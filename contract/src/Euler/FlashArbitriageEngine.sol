// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IEVC, IEthereumVaultConnector} from "../Interface/Eular/IEVC.sol";
import {IEVault} from "../Interface/Eular/IEVault.sol";
import {IEulerSwap} from "../Interface/Eular/IEulerSwap.sol";
import {IPoolManager} from "../Interface/Eular/IEulerSwap.sol";
import {IEulerRouter} from "../Interface/Eular/IEulerRouter.sol";
import {IZeroNFT} from "../Interface/IZeronft.sol";
import {ISwapVerifier} from "src/interface/Eular/ISwapVerifier.sol";
import {ISwapper} from "src/interface/Eular/ISwapper.sol";
import {EularLib} from "../libs/Eular.sol";

contract FlashArbitrageEngine is EularLib {
    using SafeERC20 for IERC20;

    // Supported tokens
    address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70; // Base WETH
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Base USDC

    // Flash arbitrage position with enhanced tracking
    struct FlashPosition {
        uint256 id;
        address user;
        address targetToken;
        uint256 targetAmount;
        uint256 borrowedAmount;
        uint256 arbitrageProfit;
        uint256 cyclesExecuted;
        bool isActive;
        uint256 createdAt;
        uint256 lastArbitrageTime;
        uint256 totalGasUsed;
        uint256 totalFeesPaid;
    }

    // Enhanced arbitrage cycle tracking
    struct ArbitrageCycle {
        uint256 positionId;
        uint256 cycleNumber;
        uint256 borrowAmount;
        uint256 profit;
        uint256 gasUsed;
        uint256 timestamp;
        bool success;
        string failureReason;
    }

    mapping(uint256 => FlashPosition) public positions;
    mapping(address => uint256[]) public userPositions;
    mapping(uint256 => ArbitrageCycle[]) public positionCycles;
    uint256 public nextPositionId;

    // Configuration
    uint256 public maxCycles = 10;
    uint256 public maxBorrowAmount = 1000000e6; // 1M USDC
    uint256 public minProfitThreshold = 100e6; // 100 USDC
    uint256 public maxSlippageBps = 50; // 0.5% max slippage
    uint256 public gasPriceLimit = 50 gwei; // Gas price limit for arbitrage
    uint256 public maxGasPerCycle = 500000; // Max gas per arbitrage cycle

    // EVC Configuration
    bool public useEVC = true; // Whether to use EVC for vault operations
    mapping(address => bool) public authorizedVaults; // Vaults authorized for EVC operations

    // Events
    event FlashPositionOpened(
        uint256 indexed positionId,
        address indexed user,
        address targetToken,
        uint256 targetAmount,
        uint256 initialBorrowAmount
    );
    event ArbitrageCycleExecuted(
        uint256 indexed positionId,
        uint256 cycle,
        uint256 profit,
        uint256 gasUsed,
        bool success
    );
    event TargetReached(
        uint256 indexed positionId,
        address indexed user,
        uint256 targetAmount,
        uint256 totalProfit
    );
    event PositionRepaid(
        uint256 indexed positionId,
        address indexed user,
        uint256 repaidAmount
    );
    event PositionLiquidated(uint256 indexed positionId, address indexed user);
    event PriceValidated(
        uint256 indexed positionId,
        address base,
        address quote,
        uint256 expectedAmount,
        uint256 actualAmount
    );
    event EVCOperationExecuted(
        uint256 indexed positionId,
        address vault,
        string operation,
        bool success
    );
    event ConfigurationUpdated(
        uint256 maxCycles,
        uint256 maxBorrowAmount,
        uint256 minProfitThreshold,
        uint256 maxSlippageBps
    );

    // Errors
    error TargetNotReached();
    error InsufficientProfit();
    error PositionExpired();
    error InvalidTargetAmount();
    error PriceValidationFailed();
    error ExcessiveSlippage();
    error GasPriceTooHigh();
    error GasLimitExceeded();
    error VaultNotAuthorized();
    error EVCOperationFailed();
    error InvalidVaultAddress();

    constructor(
        address payable _evc,
        /*address _eulerSwap,*/
        address _eulerRouter,
        address _zeroNFT
    ) EularLib(_evc, /*_eulerSwap,*/ _eulerRouter, _zeroNFT) {}

    modifier onlyAuthorizedVault(address vault) {
        if (useEVC && !authorizedVaults[vault]) {
            revert VaultNotAuthorized();
        }
        _;
    }

    /**
     * @dev Execute flash arbitrage using EVC batch operations
     * @param targetToken Token user wants (WETH or USDC)
     * @param targetAmount Amount user needs
     * @param initialBorrowAmount Initial amount to borrow for arbitrage
     * @param _maxCycles Maximum arbitrage cycles to execute
     */
    function executeFlashArbitrageWithEVC(
        address targetToken,
        uint256 targetAmount,
        uint256 initialBorrowAmount,
        uint256 _maxCycles
    ) external payable nonReentrant {
        address vaultAddress = tokenToBestVault[targetToken];
        require(vaultAddress != address(0), "Vault not set for token");
        require(
            vaultAuthorized[targetToken][vaultAddress],
            "Vault not authorized"
        );
        require(targetAmount > 0, "Invalid target amount");
        require(
            initialBorrowAmount <= maxBorrowAmount,
            "Borrow amount too high"
        );
        require(_maxCycles <= maxCycles, "Too many cycles");
        require(
            targetToken == WETH || targetToken == USDC,
            "Unsupported target token"
        );

        require(tx.gasprice <= gasPriceLimit, "Gas price too high");
        require(msg.value >= tx.gasprice, "ETH sent not enough");
        // Create flash position
        FlashPosition memory position = FlashPosition({
            id: nextPositionId,
            user: msg.sender,
            targetToken: targetToken,
            targetAmount: targetAmount,
            borrowedAmount: 0,
            arbitrageProfit: 0,
            cyclesExecuted: 0,
            isActive: true,
            createdAt: block.timestamp,
            lastArbitrageTime: 0,
            totalGasUsed: 0,
            totalFeesPaid: 0
        });

        positions[nextPositionId] = position;
        userPositions[msg.sender].push(nextPositionId);
        nextPositionId++;

        emit FlashPositionOpened(
            position.id,
            msg.sender,
            targetToken,
            targetAmount,
            initialBorrowAmount
        );

        // Execute arbitrage cycles using EVC
        uint256 currentBalance = 0;
        uint256 borrowed = 0;
        uint256 totalGasUsed = 0;

        for (uint256 cycle = 0; cycle < _maxCycles; cycle++) {
            uint256 gasStart = gasleft();

            // Check if we've reached the target
            currentBalance = IERC20(targetToken).balanceOf(address(this));
            if (currentBalance >= targetAmount) {
                break;
            }

            // Calculate how much more we need
            uint256 needed = targetAmount - currentBalance;

            // Borrow for this cycle
            uint256 borrowAmount = cycle == 0
                ? initialBorrowAmount
                : (needed * 2); // 2x for arbitrage
            if (borrowAmount > maxBorrowAmount - borrowed) {
                borrowAmount = maxBorrowAmount - borrowed;
            }

            if (borrowAmount == 0) break;

            // Execute arbitrage cycle with EVC
            uint256 profit = _executeArbitrageCycleWithEVC(
                position.id,
                targetToken,
                borrowAmount,
                vaultAddress
            );

            // Update position
            positions[position.id].borrowedAmount = borrowed + borrowAmount;
            positions[position.id].arbitrageProfit += profit;
            positions[position.id].cyclesExecuted = cycle + 1;
            positions[position.id].lastArbitrageTime = block.timestamp;

            // Calculate gas used
            uint256 gasUsed = gasStart - gasleft();
            totalGasUsed += gasUsed;

            if (gasUsed > maxGasPerCycle) {
                revert GasLimitExceeded();
            }

            // Record cycle
            ArbitrageCycle memory cycleRecord = ArbitrageCycle({
                positionId: position.id,
                cycleNumber: cycle + 1,
                borrowAmount: borrowAmount,
                profit: profit,
                gasUsed: gasUsed,
                timestamp: block.timestamp,
                success: true,
                failureReason: ""
            });
            positionCycles[position.id].push(cycleRecord);

            emit ArbitrageCycleExecuted(
                position.id,
                cycle + 1,
                profit,
                gasUsed,
                true
            );

            borrowed += borrowAmount;
        }

        // Update total gas used
        positions[position.id].totalGasUsed = totalGasUsed;

        // Check if target was reached
        currentBalance = IERC20(targetToken).balanceOf(address(this));
        if (currentBalance >= targetAmount) {
            // Transfer target amount to user
            IERC20(targetToken).safeTransfer(msg.sender, targetAmount);

            // Update position
            positions[position.id].targetAmount = targetAmount;

            emit TargetReached(
                position.id,
                msg.sender,
                targetAmount,
                positions[position.id].arbitrageProfit
            );
        } else {
            // Target not reached, revert
            revert TargetNotReached();
        }
    }

    /**
     * @dev Execute a single arbitrage cycle using EVC batch operations
     * @param positionId ID of the position for event emission
     * @param targetToken Token we want to accumulate
     * @param borrowAmount Amount borrowed for this cycle
     * @param vaultAddress Address of the vault to borrow from
     */
    function _executeArbitrageCycleWithEVC(
        uint256 positionId,
        address targetToken,
        uint256 borrowAmount,
        address vaultAddress
    ) internal returns (uint256 profit) {
        uint256 initialBalance = IERC20(targetToken).balanceOf(address(this));

        // Create EVC batch for this arbitrage cycle
        IEVC.BatchItem[] memory batchItems = new IEVC.BatchItem[](4);

        // Step 1: Borrow from vault
        batchItems[0] = IEVC.BatchItem({
            targetContract: vaultAddress,
            onBehalfOfAccount: address(this),
            value: 0,
            data: abi.encodeWithSelector(
                IEVault.borrow.selector,
                borrowAmount,
                address(this)
            )
        });

        // Step 2: Execute first swap
        (address asset0, ) = eulerSwap.getAssets();
        bool zeroForOne = asset0 == (targetToken == USDC ? WETH : USDC);

        uint256 swapAmount = eulerSwap.computeQuote(
            targetToken == USDC ? WETH : USDC,
            targetToken,
            borrowAmount,
            true
        );

        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: zeroForOne,
            amountSpecified: int256(borrowAmount),
            sqrtPriceLimitX96: 0
        });

        batchItems[1] = IEVC.BatchItem({
            targetContract: address(eulerSwap),
            onBehalfOfAccount: address(this),
            value: 0,
            data: abi.encodeWithSelector(
                IEulerSwap.swap.selector,
                zeroForOne ? 0 : swapAmount,
                zeroForOne ? swapAmount : 0,
                address(this),
                abi.encode(params)
            )
        });

        // Step 3: Execute reverse swap
        uint256 reverseAmount = eulerSwap.computeQuote(
            targetToken,
            targetToken == USDC ? WETH : USDC,
            swapAmount,
            true
        );

        params = IPoolManager.SwapParams({
            zeroForOne: !zeroForOne,
            amountSpecified: int256(swapAmount),
            sqrtPriceLimitX96: 0
        });

        batchItems[2] = IEVC.BatchItem({
            targetContract: address(eulerSwap),
            onBehalfOfAccount: address(this),
            value: 0,
            data: abi.encodeWithSelector(
                IEulerSwap.swap.selector,
                !zeroForOne ? 0 : reverseAmount,
                !zeroForOne ? reverseAmount : 0,
                address(this),
                abi.encode(params)
            )
        });

        // Step 4: Repay vault
        batchItems[3] = IEVC.BatchItem({
            targetContract: vaultAddress,
            onBehalfOfAccount: address(this),
            value: 0,
            data: abi.encodeWithSelector(
                IEVault.repay.selector,
                borrowAmount,
                address(this)
            )
        });

        // Execute EVC batch
        try evc.batch(batchItems) {
            emit EVCOperationExecuted(
                positionId,
                vaultAddress,
                "arbitrage_cycle",
                true
            );
        } catch {
            emit EVCOperationExecuted(
                positionId,
                vaultAddress,
                "arbitrage_cycle",
                false
            );
            revert EVCOperationFailed();
        }

        uint256 finalBalance = IERC20(targetToken).balanceOf(address(this));
        profit = finalBalance > initialBalance
            ? finalBalance - initialBalance
            : 0;

        return profit;
    }

    // /**
    //  * @dev Execute flash arbitrage with traditional vault operations (fallback)
    //  * @param targetToken Token user wants (WETH or USDC)
    //  * @param targetAmount Amount user needs
    //  * @param initialBorrowAmount Initial amount to borrow for arbitrage
    //  * @param _maxCycles Maximum arbitrage cycles to execute
    //  */
    // function executeFlashArbitrageTraditional(
    //     address targetToken,
    //     uint256 targetAmount,
    //     uint256 initialBorrowAmount,
    //     uint256 _maxCycles
    // ) external payable nonReentrant {
    //     address vaultAddress = tokenToBestVault[targetToken];
    //     require(vaultAddress != address(0), "Vault not set for token");
    //     require(targetAmount > 0, "Invalid target amount");
    //     require(
    //         initialBorrowAmount <= maxBorrowAmount,
    //         "Borrow amount too high"
    //     );
    //     require(_maxCycles <= maxCycles, "Too many cycles");
    //     require(
    //         targetToken == WETH || targetToken == USDC,
    //         "Unsupported target token"
    //     );
    //     require(msg.value > 0, "No ETH sent");

    //     // Wrap ETH to WETH
    //     wrapEth();

    //     // Deposit WETH collateral to vault
    //     IEVault vault = IEVault(vaultAddress);
    //     IERC20(WETH).approve(address(vault), msg.value);
    //     vault.deposit(msg.value, address(this));

    //     // Create flash position
    //     FlashPosition memory position = FlashPosition({
    //         id: nextPositionId,
    //         user: msg.sender,
    //         targetToken: targetToken,
    //         targetAmount: targetAmount,
    //         borrowedAmount: 0,
    //         arbitrageProfit: 0,
    //         cyclesExecuted: 0,
    //         isActive: true,
    //         createdAt: block.timestamp,
    //         lastArbitrageTime: 0,
    //         totalGasUsed: 0,
    //         totalFeesPaid: 0
    //     });

    //     positions[nextPositionId] = position;
    //     userPositions[msg.sender].push(nextPositionId);
    //     nextPositionId++;

    //     emit FlashPositionOpened(
    //         position.id,
    //         msg.sender,
    //         targetToken,
    //         targetAmount,
    //         initialBorrowAmount
    //     );

    //     // Execute arbitrage cycles
    //     uint256 currentBalance = 0;
    //     uint256 borrowed = 0;

    //     for (uint256 cycle = 0; cycle < _maxCycles; cycle++) {
    //         // Check if we've reached the target
    //         currentBalance = IERC20(targetToken).balanceOf(address(this));
    //         if (currentBalance >= targetAmount) {
    //             break;
    //         }

    //         // Calculate how much more we need
    //         uint256 needed = targetAmount - currentBalance;

    //         // Borrow for this cycle
    //         uint256 borrowAmount = cycle == 0
    //             ? initialBorrowAmount
    //             : (needed * 2); // 2x for arbitrage
    //         if (borrowAmount > maxBorrowAmount - borrowed) {
    //             borrowAmount = maxBorrowAmount - borrowed;
    //         }

    //         if (borrowAmount == 0) break;

    //         // Borrow from vault
    //         vault.borrow(borrowAmount, address(this));
    //         borrowed += borrowAmount;

    //         // Execute arbitrage cycle
    //         uint256 profit = _executeArbitrageCycle(
    //             position.id,
    //             targetToken,
    //             borrowAmount
    //         );

    //         // Update position
    //         positions[position.id].borrowedAmount = borrowed;
    //         positions[position.id].arbitrageProfit += profit;
    //         positions[position.id].cyclesExecuted = cycle + 1;

    //         emit ArbitrageCycleExecuted(
    //             position.id,
    //             cycle + 1,
    //             profit,
    //             0,
    //             true
    //         );

    //         // Repay the borrowed amount
    //         IERC20(vault.asset()).approve(address(vault), borrowAmount);
    //         vault.repay(borrowAmount, address(this));
    //         borrowed -= borrowAmount;
    //     }

    //     // Check if target was reached
    //     currentBalance = IERC20(targetToken).balanceOf(address(this));
    //     if (currentBalance >= targetAmount) {
    //         // Transfer target amount to user
    //         IERC20(targetToken).safeTransfer(msg.sender, targetAmount);

    //         // Update position
    //         positions[position.id].targetAmount = targetAmount;

    //         emit TargetReached(
    //             position.id,
    //             msg.sender,
    //             targetAmount,
    //             positions[position.id].arbitrageProfit
    //         );
    //     } else {
    //         // Target not reached, revert
    //         revert TargetNotReached();
    //     }
    // }

    // /**
    //  * @dev Execute a single arbitrage cycle with price validation (traditional method)
    //  * @param positionId ID of the position for event emission
    //  * @param targetToken Token we want to accumulate
    //  * @param borrowAmount Amount borrowed for this cycle
    //  */
    // function _executeArbitrageCycle(
    //     uint256 positionId,
    //     address targetToken,
    //     uint256 borrowAmount
    // ) internal returns (uint256 profit) {
    //     uint256 initialBalance = IERC20(targetToken).balanceOf(address(this));

    //     (address asset0, ) = eulerSwap.getAssets();

    //     if (targetToken == USDC) {
    //         // WETH -> USDC -> WETH arbitrage
    //         IERC20(WETH).approve(address(eulerSwap), borrowAmount);

    //         // Validate WETH -> USDC price with Euler Router
    //         (uint256 expectedUsdcAmount, ) = _validatePrice(
    //             borrowAmount,
    //             WETH,
    //             USDC
    //         );
    //         uint256 usdcAmount = eulerSwap.computeQuote(
    //             WETH,
    //             USDC,
    //             borrowAmount,
    //             true
    //         );

    //         // Check slippage tolerance
    //         uint256 minUsdcAmount = (expectedUsdcAmount *
    //             (10000 - maxSlippageBps)) / 10000;
    //         if (usdcAmount < minUsdcAmount) {
    //             revert ExcessiveSlippage();
    //         }

    //         // Emit price validation event
    //         emit PriceValidated(
    //             positionId,
    //             WETH,
    //             USDC,
    //             expectedUsdcAmount,
    //             usdcAmount
    //         );

    //         bool zeroForOne = asset0 == WETH;
    //         IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
    //             zeroForOne: zeroForOne,
    //             amountSpecified: int256(borrowAmount),
    //             sqrtPriceLimitX96: 0
    //         });
    //         bytes memory swapData = abi.encode(params);

    //         if (zeroForOne) {
    //             eulerSwap.swap(0, usdcAmount, address(this), swapData);
    //         } else {
    //             eulerSwap.swap(usdcAmount, 0, address(this), swapData);
    //         }

    //         // USDC -> WETH (with price validation)
    //         IERC20(USDC).approve(address(eulerSwap), usdcAmount);

    //         // Validate USDC -> WETH price with Euler Router
    //         (uint256 expectedWethAmount, ) = _validatePrice(
    //             usdcAmount,
    //             USDC,
    //             WETH
    //         );
    //         uint256 wethAmount = eulerSwap.computeQuote(
    //             USDC,
    //             WETH,
    //             usdcAmount,
    //             true
    //         );

    //         // Check slippage tolerance
    //         uint256 minWethAmount = (expectedWethAmount *
    //             (10000 - maxSlippageBps)) / 10000;
    //         if (wethAmount < minWethAmount) {
    //             revert ExcessiveSlippage();
    //         }

    //         // Emit price validation event
    //         emit PriceValidated(
    //             positionId,
    //             USDC,
    //             WETH,
    //             expectedWethAmount,
    //             wethAmount
    //         );

    //         zeroForOne = asset0 == USDC;
    //         params = IPoolManager.SwapParams({
    //             zeroForOne: zeroForOne,
    //             amountSpecified: int256(usdcAmount),
    //             sqrtPriceLimitX96: 0
    //         });
    //         swapData = abi.encode(params);

    //         if (zeroForOne) {
    //             eulerSwap.swap(0, wethAmount, address(this), swapData);
    //         } else {
    //             eulerSwap.swap(wethAmount, 0, address(this), swapData);
    //         }

    //         uint256 finalWeth = IERC20(WETH).balanceOf(address(this));
    //         profit = finalWeth > initialBalance
    //             ? finalWeth - initialBalance
    //             : 0;
    //     } else {
    //         // USDC -> WETH -> USDC arbitrage
    //         IERC20(USDC).approve(address(eulerSwap), borrowAmount);

    //         // Validate USDC -> WETH price with Euler Router
    //         (uint256 expectedWethAmount, ) = _validatePrice(
    //             borrowAmount,
    //             USDC,
    //             WETH
    //         );
    //         uint256 wethAmount = eulerSwap.computeQuote(
    //             USDC,
    //             WETH,
    //             borrowAmount,
    //             true
    //         );

    //         // Check slippage tolerance
    //         uint256 minWethAmount = (expectedWethAmount *
    //             (10000 - maxSlippageBps)) / 10000;
    //         if (wethAmount < minWethAmount) {
    //             revert ExcessiveSlippage();
    //         }

    //         // Emit price validation event
    //         emit PriceValidated(
    //             positionId,
    //             USDC,
    //             WETH,
    //             expectedWethAmount,
    //             wethAmount
    //         );

    //         bool zeroForOne = asset0 == USDC;
    //         IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
    //             zeroForOne: zeroForOne,
    //             amountSpecified: int256(borrowAmount),
    //             sqrtPriceLimitX96: 0
    //         });
    //         bytes memory swapData = abi.encode(params);

    //         if (zeroForOne) {
    //             eulerSwap.swap(0, wethAmount, address(this), swapData);
    //         } else {
    //             eulerSwap.swap(wethAmount, 0, address(this), swapData);
    //         }

    //         // WETH -> USDC (with price validation)
    //         IERC20(WETH).approve(address(eulerSwap), wethAmount);

    //         // Validate WETH -> USDC price with Euler Router
    //         (uint256 expectedUsdcAmount, ) = _validatePrice(
    //             wethAmount,
    //             WETH,
    //             USDC
    //         );
    //         uint256 usdcAmount = eulerSwap.computeQuote(
    //             WETH,
    //             USDC,
    //             wethAmount,
    //             true
    //         );

    //         // Check slippage tolerance
    //         uint256 minUsdcAmount = (expectedUsdcAmount *
    //             (10000 - maxSlippageBps)) / 10000;
    //         if (usdcAmount < minUsdcAmount) {
    //             revert ExcessiveSlippage();
    //         }

    //         // Emit price validation event
    //         emit PriceValidated(
    //             positionId,
    //             WETH,
    //             USDC,
    //             expectedUsdcAmount,
    //             usdcAmount
    //         );

    //         zeroForOne = asset0 == WETH;
    //         params = IPoolManager.SwapParams({
    //             zeroForOne: zeroForOne,
    //             amountSpecified: int256(wethAmount),
    //             sqrtPriceLimitX96: 0
    //         });
    //         swapData = abi.encode(params);

    //         if (zeroForOne) {
    //             eulerSwap.swap(0, usdcAmount, address(this), swapData);
    //         } else {
    //             eulerSwap.swap(usdcAmount, 0, address(this), swapData);
    //         }

    //         uint256 finalUsdc = IERC20(USDC).balanceOf(address(this));
    //         profit = finalUsdc > initialBalance
    //             ? finalUsdc - initialBalance
    //             : 0;
    //     }

    //     return profit;
    // }

    /**
     * @dev Validate price using Euler Router oracle
     * @param inAmount Input amount for quote
     * @param base Base token address
     * @param quote Quote token address
     * @return expectedOutAmount Expected output amount from router
     * @return oracleAddress Address of the oracle used
     */
    function _validatePrice(
        uint256 inAmount,
        address base,
        address quote
    ) internal view returns (uint256 expectedOutAmount, address oracleAddress) {
        try eulerRouter.getQuote(inAmount, base, quote) returns (
            uint256 quoteAmount
        ) {
            expectedOutAmount = quoteAmount;

            // Resolve oracle to get oracle address
            try eulerRouter.resolveOracle(inAmount, base, quote) returns (
                uint256 resolvedAmount,
                address resolvedOracle,
                address resolvedBase,
                address resolvedQuote
            ) {
                oracleAddress = resolvedOracle;
            } catch {
                oracleAddress = address(0);
            }
        } catch {
            revert PriceValidationFailed();
        }
    }

    /**
     * @dev Get user's flash positions
     * @param user Address of the user
     */
    function getUserPositions(
        address user
    ) external view returns (uint256[] memory) {
        return userPositions[user];
    }

    /**
     * @dev Get position by ID
     * @param positionId ID of the position
     */
    function getPosition(
        uint256 positionId
    ) external view returns (FlashPosition memory) {
        return positions[positionId];
    }

    /**
     * @dev Get arbitrage cycles for a position
     * @param positionId ID of the position
     */
    function getPositionCycles(
        uint256 positionId
    ) external view returns (ArbitrageCycle[] memory) {
        return positionCycles[positionId];
    }

    /**
     * @dev Update configuration
     */
    function updateConfig(
        uint256 _maxCycles,
        uint256 _maxBorrowAmount,
        uint256 _minProfitThreshold,
        uint256 _maxSlippageBps
    ) external {
        maxCycles = _maxCycles;
        maxBorrowAmount = _maxBorrowAmount;
        minProfitThreshold = _minProfitThreshold;
        maxSlippageBps = _maxSlippageBps;

        emit ConfigurationUpdated(
            _maxCycles,
            _maxBorrowAmount,
            _minProfitThreshold,
            _maxSlippageBps
        );
    }

    /**
     * @dev Update gas configuration
     */
    function updateGasConfig(
        uint256 _gasPriceLimit,
        uint256 _maxGasPerCycle
    ) external {
        gasPriceLimit = _gasPriceLimit;
        maxGasPerCycle = _maxGasPerCycle;
    }

    /**
     * @dev Toggle EVC usage
     */
    function toggleEVC(bool _useEVC) external {
        useEVC = _useEVC;
    }

    /**
     * @dev Authorize a vault for EVC operations
     */
    function authorizeVault(address vault, bool authorized) external {
        if (vault == address(0)) {
            revert InvalidVaultAddress();
        }
        authorizedVaults[vault] = authorized;
    }

    /**
     * @dev Get price quote from Euler Router
     * @param inAmount Input amount
     * @param base Base token address
     * @param quote Quote token address
     * @return quoteAmount Expected output amount
     */
    function getPriceQuote(
        uint256 inAmount,
        address base,
        address quote
    ) external view returns (uint256 quoteAmount) {
        return eulerRouter.getQuote(inAmount, base, quote);
    }

    /**
     * @dev Get oracle information for a token pair
     * @param inAmount Input amount
     * @param base Base token address
     * @param quote Quote token address
     * @return resolvedAmount Resolved amount
     * @return oracleAddress Oracle address
     * @return resolvedBase Resolved base token
     * @return resolvedQuote Resolved quote token
     */
    function getOracleInfo(
        uint256 inAmount,
        address base,
        address quote
    )
        external
        view
        returns (
            uint256 resolvedAmount,
            address oracleAddress,
            address resolvedBase,
            address resolvedQuote
        )
    {
        return eulerRouter.resolveOracle(inAmount, base, quote);
    }

    /**
     * @dev Emergency function to rescue stuck tokens
     */
    function rescueTokens(address token, uint256 amount) external {
        IERC20(token).safeTransfer(owner, amount);
    }

    /**
     * @dev Allow contract to receive ETH
     */
    receive() external payable {}

    /**
     * @dev Wrap ETH to WETH
     */
    function wrapEth() internal {
        // Call WETH contract's deposit function
        (bool success, ) = WETH.call{value: msg.value}("");
        require(success, "ETH wrapping failed");
    }

    ////////////////////////////////////////////
    /////////////// Zero collateral system and logic

    // /**
    //  * @dev Get all pending zero collateral requests
    //  */
    // function getPendingZeroRequests() external view returns (uint256[] memory) {
    //     uint256[] memory pendingRequests = new uint256[](_requestIdCounter);
    //     uint256 count = 0;

    //     for (uint256 i = 0; i < _requestIdCounter; i++) {
    //         if (requests[i].status == RequestStatus.Pending) {
    //             pendingRequests[count] = i;
    //             count++;
    //         }
    //     }

    //     // Resize array to actual count
    //     assembly {
    //         mstore(pendingRequests, count)
    //     }

    //     return pendingRequests;
    // }

    /**
     * @dev Add a vault for a token (only owner)
     */
    function addTokenVault(address token, address vault) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(vault != address(0), "Invalid vault");
        require(!vaultAuthorized[token][vault], "Vault already added");

        tokenToVaults[token].push(vault);
        vaultAuthorized[token][vault] = true;
        vaultInfo[vault] = VaultInfo({
            totalLiquidity: 0,
            borrowRate: 0,
            utilizationRate: 0,
            isActive: true,
            lastUpdateTime: block.timestamp
        });

        emit VaultAdded(token, vault);
        _updateBestVault(token);
    }

    /**
     * @dev Remove a vault for a token (only owner)
     */
    function removeTokenVault(address token, address vault) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(vault != address(0), "Invalid vault");
        require(vaultAuthorized[token][vault], "Vault not found");

        // Remove from array
        address[] storage vaults = tokenToVaults[token];
        for (uint i = 0; i < vaults.length; i++) {
            if (vaults[i] == vault) {
                vaults[i] = vaults[vaults.length - 1];
                vaults.pop();
                break;
            }
        }

        vaultAuthorized[token][vault] = false;
        vaultInfo[vault].isActive = false;

        emit VaultRemoved(token, vault);
        _updateBestVault(token);
    }

    /**
     * @dev Update vault information (only owner)
     */
    function updateVaultInfo(
        address vault,
        uint256 liquidity,
        uint256 borrowRate,
        uint256 utilizationRate
    ) external onlyOwner {
        require(vault != address(0), "Invalid vault");
        vaultInfo[vault].totalLiquidity = liquidity;
        vaultInfo[vault].borrowRate = borrowRate;
        vaultInfo[vault].utilizationRate = utilizationRate;
        vaultInfo[vault].lastUpdateTime = block.timestamp;

        emit VaultInfoUpdated(vault, liquidity, borrowRate);

        // Update best vault for all tokens using this vault
        for (uint i = 0; i < _getAllTokens().length; i++) {
            address token = _getAllTokens()[i];
            if (vaultAuthorized[token][vault]) {
                _updateBestVault(token);
            }
        }
    }

    /**
     * @dev Get all vaults for a token
     */
    function getTokenVaults(
        address token
    ) external view returns (address[] memory) {
        return tokenToVaults[token];
    }

    /**
     * @dev Get vault information
     */
    function getVaultInfo(
        address vault
    ) external view returns (VaultInfo memory) {
        return vaultInfo[vault];
    }

    /**
     * @dev Get best vault for a token
     */
    function getBestVault(address token) external view returns (address) {
        return tokenToBestVault[token];
    }

    /**
     * @dev Update the best vault for a token based on scoring
     */
    function _updateBestVault(address token) internal {
        address[] storage vaults = tokenToVaults[token];
        address bestVault = address(0);
        uint256 bestScore = 0;

        for (uint i = 0; i < vaults.length; i++) {
            address vault = vaults[i];
            if (!vaultAuthorized[token][vault] || !vaultInfo[vault].isActive)
                continue;

            VaultInfo memory info = vaultInfo[vault];
            uint256 score = _calculateVaultScore(info);

            if (score > bestScore) {
                bestScore = score;
                bestVault = vault;
            }
        }

        if (bestVault != tokenToBestVault[token]) {
            tokenToBestVault[token] = bestVault;
            emit BestVaultUpdated(token, bestVault);
        }
    }

    /**
     * @dev Calculate vault score based on liquidity, rates, and utilization
     */
    function _calculateVaultScore(
        VaultInfo memory info
    ) internal pure returns (uint256) {
        // Higher liquidity = better score
        // Lower borrow rate = better score
        // Lower utilization = better score
        // Formula: (liquidity * 1000) / (borrowRate + 1) * (100 - utilizationRate) / 100

        if (info.borrowRate == 0) return 0;

        uint256 liquidityScore = info.totalLiquidity * 1000;
        uint256 rateScore = liquidityScore / (info.borrowRate + 1);
        uint256 utilizationScore = (rateScore * (100 - info.utilizationRate)) /
            100;

        return utilizationScore;
    }

    /**
     * @dev Get all supported tokens (for vault updates)
     */
    function _getAllTokens() internal view returns (address[] memory) {
        // This would need to be implemented based on your token tracking
        // For now, return a hardcoded list or implement a token registry
        address[] memory tokens = new address[](2);
        tokens[0] = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70; // WETH
        tokens[1] = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // USDC
        return tokens;
    }

    /**
     * @dev Update vault information from on-chain data (only owner)
     * This function can be called periodically to keep vault info current
     */
    function updateVaultInfoFromChain(address vault) external onlyOwner {
        require(vault != address(0), "Invalid vault");
        require(vaultInfo[vault].isActive, "Vault not active");

        try IEVault(vault).totalAssets() returns (uint256 totalAssets) {
            try IEVault(vault).totalBorrows() returns (uint256 totalBorrows) {
                uint256 utilizationRate = totalAssets > 0
                    ? (totalBorrows * 100) / totalAssets
                    : 0;

                // Get borrow rate from vault (this would need to be implemented based on Euler's API)
                uint256 borrowRate = 500; // Default 5% - should be fetched from vault

                vaultInfo[vault].totalLiquidity = totalAssets;
                vaultInfo[vault].borrowRate = borrowRate;
                vaultInfo[vault].utilizationRate = utilizationRate;
                vaultInfo[vault].lastUpdateTime = block.timestamp;

                emit VaultInfoUpdated(vault, totalAssets, borrowRate);

                // Update best vault for all tokens using this vault
                for (uint i = 0; i < _getAllTokens().length; i++) {
                    address token = _getAllTokens()[i];
                    if (vaultAuthorized[token][vault]) {
                        _updateBestVault(token);
                    }
                }
            } catch {
                // Vault doesn't support totalBorrows, use default values
            }
        } catch {
            // Vault doesn't support totalAssets, skip update
        }
    }

    /**
     * @dev Batch update vault information for all vaults of a token
     */
    function updateAllVaultInfoForToken(address token) external onlyOwner {
        address[] storage vaults = tokenToVaults[token];
        for (uint i = 0; i < vaults.length; i++) {
            if (vaultInfo[vaults[i]].isActive) {
                this.updateVaultInfoFromChain(vaults[i]);
            }
        }
    }
}
