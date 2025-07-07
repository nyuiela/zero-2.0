// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Treasury
 * @dev Manages collateral for the zero collateral system
 */
contract Treasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Mapping to track collateral balances
    mapping(address => uint256) public collateralBalances;
    mapping(address => mapping(address => uint256)) public userCollateral; // user => token => amount

    // Events
    event CollateralDeposited(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event CollateralWithdrawn(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event CollateralTransferred(
        address indexed from,
        address indexed to,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event EmergencyWithdraw(
        address indexed token,
        uint256 amount,
        address indexed recipient,
        uint256 timestamp
    );

    // Errors
    error InsufficientCollateral();
    error InvalidAmount();
    error InvalidAddress();
    error TransferFailed();

    constructor() Ownable(msg.sender) {}

 

    /**
     * @dev Transfer collateral between users (for zero collateral system)
     * @param from User to transfer from
     * @param to User to transfer to
     * @param token Token to transfer
     * @param amount Amount to transfer
     */
    function transferCollateral(
        address from,
        address to,
        address token,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(from != address(0) && to != address(0), "Invalid addresses");
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Invalid amount");
        require(userCollateral[from][token] >= amount, "Insufficient collateral");

        // Update balances
        userCollateral[from][token] -= amount;
        userCollateral[to][token] += amount;

        emit CollateralTransferred(from, to, token, amount, block.timestamp);
    }

    /**
     * @dev Get user's collateral balance for a specific token
     * @param user User address
     * @param token Token address
     */
    function getUserCollateral(address user, address token) external view returns (uint256) {
        return userCollateral[user][token];
    }

    /**
     * @dev Get total collateral balance for a token
     * @param token Token address
     */
    function getTotalCollateral(address token) external view returns (uint256) {
        return collateralBalances[token];
    }

    /**
     * @dev Emergency withdraw function for owner
     * @param token Token to withdraw
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function emergencyWithdraw(
        address token,
        uint256 amount,
        address recipient
    ) external onlyOwner nonReentrant {
        require(token != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        require(collateralBalances[token] >= amount, "Insufficient balance");

        collateralBalances[token] -= amount;
        IERC20(token).safeTransfer(recipient, amount);

        emit EmergencyWithdraw(token, amount, recipient, block.timestamp);
    }

    /**
     * @dev Allow contract to receive ETH
     */
    receive() external payable {}

    /**
     * @dev Withdraw ETH from contract
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function withdrawETH(uint256 amount, address recipient) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        require(address(this).balance >= amount, "Insufficient ETH balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ETH transfer failed");

        emit EmergencyWithdraw(address(0), amount, recipient, block.timestamp);
    }
}