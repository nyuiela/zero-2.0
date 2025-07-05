// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IEVault} from "src/interface/Eular/IEVault.sol";
import {IEulerSwap} from "../interface/Eular/IEulerSwap.sol";
import {IPoolManager} from "../interface/Eular/IEulerSwap.sol";

interface IWETH is IERC20 {
    function deposit() external payable;

    // function withdraw(uint256 amount) external;

    // change to a simple wrap function
}

contract FlashArbitrageEngine {
    using SafeERC20 for IERC20;

    IEVault public immutable vault;
    IEulerSwap public immutable eulerSwap;
    IWETH public immutable weth;

    // Supported tokens
    address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address public constant USDC = 0x7e860098F58bBFC8648a4311b374B1D669a2bc6B;

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

    address owner;

    constructor(address _vault, address _eulerSwap, address _weth) {
        vault = IEVault(_vault);
        eulerSwap = IEulerSwap(_eulerSwap);
        weth = IWETH(_weth);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "FlashArbitrage: not authorized");
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
        weth.deposit{value: msg.value}();

        // Deposit WETH collateral to vault
        //  IERC20(WETH).safeApprove(address(vault), msg.value);
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

        for (uint256 cycle = 0; cycle < maxCycles; cycle++) {
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
            uint256 profit = _executeArbitrageCycle(targetToken, borrowAmount);

            // Update position
            positions[position.id].borrowedAmount = borrowed;
            positions[position.id].arbitrageProfit += profit;
            positions[position.id].cyclesExecuted = cycle + 1;

            emit ArbitrageCycleExecuted(position.id, cycle + 1, profit);

            // Repay the borrowed amount
            //  IERC20(vault.asset()).safeApprove(address(vault), borrowAmount);
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
     * @dev Execute a single arbitrage cycle
     * @param targetToken Token we want to accumulate
     * @param borrowAmount Amount borrowed for this cycle
     */
    function _executeArbitrageCycle(
        address targetToken,
        uint256 borrowAmount
    ) internal returns (uint256 profit) {
        uint256 initialBalance = IERC20(targetToken).balanceOf(address(this));

        (address asset0, address asset1) = eulerSwap.getAssets();

        if (targetToken == USDC) {
            // WETH -> USDC -> WETH arbitrage
            // IERC20(WETH).safeApprove(address(eulerSwap), borrowAmount);

            // WETH -> USDC
            uint256 usdcAmount = eulerSwap.computeQuote(
                WETH,
                USDC,
                borrowAmount,
                true
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

            // USDC -> WETH (with some slippage for profit)
            IERC20(USDC).approve(address(eulerSwap), usdcAmount);
            uint256 wethAmount = eulerSwap.computeQuote(
                USDC,
                WETH,
                usdcAmount,
                true
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

            // USDC -> WETH
            uint256 wethAmount = eulerSwap.computeQuote(
                USDC,
                WETH,
                borrowAmount,
                true
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

            // WETH -> USDC
            // IERC20(WETH).safeApprove(address(eulerSwap), wethAmount);
            uint256 usdcAmount = eulerSwap.computeQuote(
                WETH,
                USDC,
                wethAmount,
                true
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
        uint256 _minProfitThreshold
    ) external onlyOwner {
        maxCycles = _maxCycles;
        maxBorrowAmount = _maxBorrowAmount;
        minProfitThreshold = _minProfitThreshold;
    }

    /**
     * @dev Emergency function to rescue stuck tokens
     */
    function rescueTokens(
        address token,
        uint256 amount,
        address to
    ) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    receive() external payable {}

    // function setPoolAddress(
    //     address _EVaultPool,
    //     address swapPool
    // ) public onlyOwner {
    //     vault = IEVault(_EVaultPool);
    //     eulerSwap = IEulerSwap(swapPool);
    // }

    // wraps eth to weth to be used in excution
    function wrapEth() internal {}
}
