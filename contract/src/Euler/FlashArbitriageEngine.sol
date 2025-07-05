// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IEVault} from "src/interface/Eular/IEVault.sol";
import {IEulerSwap} from "../interface/Eular/IEulerSwap.sol";
import {IPoolManager} from "../interface/Eular/IEulerSwap.sol";
import {IEulerRouter} from "../interface/Eular/IEulerRouter.sol";
import {IEVC} from "../interface/Eular/IEVC.sol";

contract FlashArbitrageEngine {
    using SafeERC20 for IERC20;

    IEVault public immutable vault;
    IEulerSwap public immutable eulerSwap;
    IEulerRouter public immutable eulerRouter;

    // Supported tokens
    address public constant WETH = 0x7e860098F58bBFC8648a4311b374B1D669a2bc6B;
    address public constant USDC = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;

    // Flash arbitrage position
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
    }

    mapping(uint256 => FlashPosition) public positions;
    mapping(address => uint256[]) public userPositions;
    uint256 public nextPositionId;

    // Reentrancy protection
    bool private _arbitrageInProgress;

    // Configuration
    uint256 public maxCycles = 10;
    uint256 public maxBorrowAmount = 1000000e6; // 1M USDC
    uint256 public minProfitThreshold = 100e6; // 100 USDC
    uint256 public maxSlippageBps = 50; // 0.5% max slippage

    // Events
    event FlashPositionOpened(
        uint256 indexed positionId,
        address indexed user,
        address targetToken,
        uint256 targetAmount
    );
    event ArbitrageCycleExecuted(
        uint256 indexed positionId,
        uint256 cycle,
        uint256 profit
    );
    event TargetReached(
        uint256 indexed positionId,
        address indexed user,
        uint256 targetAmount
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

    // Modifiers
    modifier arbitrageGuard() {
        require(!_arbitrageInProgress, "Arbitrage in progress");
        _;
    }

    // Errors
    error TargetNotReached();
    error InsufficientProfit();
    error PositionExpired();
    error InvalidTargetAmount();
    error PriceValidationFailed();
    error ExcessiveSlippage();

    address owner;

    constructor(address _vault, address _eulerSwap, address _eulerRouter) {
        vault = IEVault(_vault);
        eulerSwap = IEulerSwap(_eulerSwap);
        eulerRouter = IEulerRouter(_eulerRouter);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "FlashArbitrageEngine: not owner");
        _;
    }

    /**
     * @dev Execute flash arbitrage to reach target amount
     * @param targetToken Token user wants (WETH or USDC)
     * @param targetAmount Amount user needs
     * @param initialBorrowAmount Initial amount to borrow for arbitrage
     * @param _maxCycles Maximum arbitrage cycles to execute
     */
    function executeFlashArbitrage(
        address targetToken,
        uint256 targetAmount,
        uint256 initialBorrowAmount,
        uint256 _maxCycles
    ) external payable arbitrageGuard {
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
        require(vault.asset() == targetToken, "Vault asset mismatch");
        require(msg.value > 0, "No ETH sent");

        // Wrap ETH to WETH
        wrapEth();

        // Deposit WETH collateral to vault
        IERC20(WETH).approve(address(vault), msg.value);
        vault.deposit(msg.value, address(this));

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
            createdAt: block.timestamp
        });

        positions[nextPositionId] = position;
        userPositions[msg.sender].push(nextPositionId);
        nextPositionId++;

        emit FlashPositionOpened(
            position.id,
            msg.sender,
            targetToken,
            targetAmount
        );

        // Set reentrancy flag
        _arbitrageInProgress = true;

        // Execute arbitrage cycles
        uint256 currentBalance = 0;
        uint256 borrowed = 0;

        for (uint256 cycle = 0; cycle < _maxCycles; cycle++) {
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

            // Borrow from vault
            vault.borrow(borrowAmount, address(this));
            borrowed += borrowAmount;

            // Execute arbitrage cycle
            uint256 profit = _executeArbitrageCycle(
                position.id,
                targetToken,
                borrowAmount
            );

            // Update position
            positions[position.id].borrowedAmount = borrowed;
            positions[position.id].arbitrageProfit += profit;
            positions[position.id].cyclesExecuted = cycle + 1;

            emit ArbitrageCycleExecuted(position.id, cycle + 1, profit);

            // Repay the borrowed amount
            IERC20(vault.asset()).approve(address(vault), borrowAmount);
            vault.repay(borrowAmount, address(this));
            borrowed -= borrowAmount;
        }

        // Check if target was reached
        currentBalance = IERC20(targetToken).balanceOf(address(this));
        if (currentBalance >= targetAmount) {
            // Transfer target amount to user
            IERC20(targetToken).safeTransfer(msg.sender, targetAmount);

            // Update position
            positions[position.id].targetAmount = targetAmount;

            emit TargetReached(position.id, msg.sender, targetAmount);
        } else {
            // Target not reached, revert
            _arbitrageInProgress = false;
            revert TargetNotReached();
        }

        // Clear reentrancy flag
        _arbitrageInProgress = false;
    }

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
     * @dev Execute a single arbitrage cycle with price validation
     * @param positionId ID of the position for event emission
     * @param targetToken Token we want to accumulate
     * @param borrowAmount Amount borrowed for this cycle
     */
    function _executeArbitrageCycle(
        uint256 positionId,
        address targetToken,
        uint256 borrowAmount
    ) internal returns (uint256 profit) {
        uint256 initialBalance = IERC20(targetToken).balanceOf(address(this));

        (address asset0, address asset1) = eulerSwap.getAssets();

        if (targetToken == USDC) {
            // WETH -> USDC -> WETH arbitrage
            IERC20(WETH).approve(address(eulerSwap), borrowAmount);

            // Validate WETH -> USDC price with Euler Router
            (uint256 expectedUsdcAmount, ) = _validatePrice(
                borrowAmount,
                WETH,
                USDC
            );
            uint256 usdcAmount = eulerSwap.computeQuote(
                WETH,
                USDC,
                borrowAmount,
                true
            );

            // Check slippage tolerance
            uint256 minUsdcAmount = (expectedUsdcAmount *
                (10000 - maxSlippageBps)) / 10000;
            if (usdcAmount < minUsdcAmount) {
                revert ExcessiveSlippage();
            }

            // Emit price validation event
            emit PriceValidated(
                positionId,
                WETH,
                USDC,
                expectedUsdcAmount,
                usdcAmount
            );

            bool zeroForOne = asset0 == WETH;
            IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
                zeroForOne: zeroForOne,
                amountSpecified: int256(borrowAmount),
                sqrtPriceLimitX96: 0
            });
            bytes memory swapData = abi.encode(params);

            if (zeroForOne) {
                eulerSwap.swap(0, usdcAmount, address(this), swapData);
            } else {
                eulerSwap.swap(usdcAmount, 0, address(this), swapData);
            }

            // USDC -> WETH (with price validation)
            IERC20(USDC).approve(address(eulerSwap), usdcAmount);

            // Validate USDC -> WETH price with Euler Router
            (uint256 expectedWethAmount, ) = _validatePrice(
                usdcAmount,
                USDC,
                WETH
            );
            uint256 wethAmount = eulerSwap.computeQuote(
                USDC,
                WETH,
                usdcAmount,
                true
            );

            // Check slippage tolerance
            uint256 minWethAmount = (expectedWethAmount *
                (10000 - maxSlippageBps)) / 10000;
            if (wethAmount < minWethAmount) {
                revert ExcessiveSlippage();
            }

            // Emit price validation event
            emit PriceValidated(
                positionId,
                USDC,
                WETH,
                expectedWethAmount,
                wethAmount
            );

            zeroForOne = asset0 == USDC;
            params = IPoolManager.SwapParams({
                zeroForOne: zeroForOne,
                amountSpecified: int256(usdcAmount),
                sqrtPriceLimitX96: 0
            });
            swapData = abi.encode(params);

            if (zeroForOne) {
                eulerSwap.swap(0, wethAmount, address(this), swapData);
            } else {
                eulerSwap.swap(wethAmount, 0, address(this), swapData);
            }

            uint256 finalWeth = IERC20(WETH).balanceOf(address(this));
            profit = finalWeth > initialBalance
                ? finalWeth - initialBalance
                : 0;
        } else {
            // USDC -> WETH -> USDC arbitrage
            IERC20(USDC).approve(address(eulerSwap), borrowAmount);

            // Validate USDC -> WETH price with Euler Router
            (uint256 expectedWethAmount, ) = _validatePrice(
                borrowAmount,
                USDC,
                WETH
            );
            uint256 wethAmount = eulerSwap.computeQuote(
                USDC,
                WETH,
                borrowAmount,
                true
            );

            // Check slippage tolerance
            uint256 minWethAmount = (expectedWethAmount *
                (10000 - maxSlippageBps)) / 10000;
            if (wethAmount < minWethAmount) {
                revert ExcessiveSlippage();
            }

            // Emit price validation event
            emit PriceValidated(
                positionId,
                USDC,
                WETH,
                expectedWethAmount,
                wethAmount
            );

            bool zeroForOne = asset0 == USDC;
            IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
                zeroForOne: zeroForOne,
                amountSpecified: int256(borrowAmount),
                sqrtPriceLimitX96: 0
            });
            bytes memory swapData = abi.encode(params);

            if (zeroForOne) {
                eulerSwap.swap(0, wethAmount, address(this), swapData);
            } else {
                eulerSwap.swap(wethAmount, 0, address(this), swapData);
            }

            // WETH -> USDC (with price validation)
            IERC20(WETH).approve(address(eulerSwap), wethAmount);

            // Validate WETH -> USDC price with Euler Router
            (uint256 expectedUsdcAmount, ) = _validatePrice(
                wethAmount,
                WETH,
                USDC
            );
            uint256 usdcAmount = eulerSwap.computeQuote(
                WETH,
                USDC,
                wethAmount,
                true
            );

            // Check slippage tolerance
            uint256 minUsdcAmount = (expectedUsdcAmount *
                (10000 - maxSlippageBps)) / 10000;
            if (usdcAmount < minUsdcAmount) {
                revert ExcessiveSlippage();
            }

            // Emit price validation event
            emit PriceValidated(
                positionId,
                WETH,
                USDC,
                expectedUsdcAmount,
                usdcAmount
            );

            zeroForOne = asset0 == WETH;
            params = IPoolManager.SwapParams({
                zeroForOne: zeroForOne,
                amountSpecified: int256(wethAmount),
                sqrtPriceLimitX96: 0
            });
            swapData = abi.encode(params);

            if (zeroForOne) {
                eulerSwap.swap(0, usdcAmount, address(this), swapData);
            } else {
                eulerSwap.swap(usdcAmount, 0, address(this), swapData);
            }

            uint256 finalUsdc = IERC20(USDC).balanceOf(address(this));
            profit = finalUsdc > initialBalance
                ? finalUsdc - initialBalance
                : 0;
        }

        return profit;
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
     * @dev Update configuration
     */
    function updateConfig(
        uint256 _maxCycles,
        uint256 _maxBorrowAmount,
        uint256 _minProfitThreshold,
        uint256 _maxSlippageBps
    ) external onlyOwner {
        maxCycles = _maxCycles;
        maxBorrowAmount = _maxBorrowAmount;
        minProfitThreshold = _minProfitThreshold;
        maxSlippageBps = _maxSlippageBps;
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
    function rescueTokens(address token, uint256 amount) external onlyOwner {
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
}
