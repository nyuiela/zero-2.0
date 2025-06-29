//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

//import "contract/src/libs/PermissionModifier.sol";
import {PermissionModifiers} from "../libs/PermissionModifier.sol";
import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";

/**
 * @notice this contract manages all fees in the protocol
 * Maintainance fee
 * Tax fee
 * Protocol Fee
 * Bonus interest Fee
 */
// changed and left only protocol fee other fee should be brand specific
// fee will be taken in eth
contract Fee {
    bytes4 public constant SET_FEE = bytes4(keccak256("setfee(uint256)"));
    bytes4 public constant SET_FEE_RECEIVER = bytes4(keccak256("setFeeReceiver(address)"));
    bytes4 public constant WITHDRAW_FEE = bytes4(keccak256("withdrawFee()"));

    uint256 public constant PRESICION = 10_000;
    uint256 public constant MAX_FEE = 1000; // 10% in basis points
    address auctionContract;
    address private receiver;
    uint256 fee;
    uint256 private totalFeeAccummulated;
    uint256 public stakeAmountRequired;

    using PermissionModifiers for address;

    address public permissionManagerImplementation;
    address public globalPermissionManager;

    //// internal fee calculations

    function feeOnPurchase(uint256 _cost, address buyer) public payable onlyauction {
        uint256 protocolFee = MulDiv(_cost, fee, PRESICION);
        require(msg.value >= protocolFee, "Fee: Insufficient payment for protocol fee");
        payable(buyer).transfer(protocolFee);
    }

    function setFee(uint256 _fee) external {
        require(globalPermissionManager.hasPermission(msg.sender, SET_FEE), "Fee: Unauthorized");
        require(_fee <= MAX_FEE, "Fee: Fee exceeds maximum limit");
        fee = _fee;
    }

    function setFeeReceiver(address _receiver) external {
        require(_receiver != address(0), "Fee: Invalid receiver address");
        require(globalPermissionManager.hasPermission(msg.sender, SET_FEE_RECEIVER), "Fee: Unauthorized");
        receiver = _receiver;
    }

    function withdrawFee() external {
        require(globalPermissionManager.hasPermission(msg.sender, WITHDRAW_FEE), "Fee: Unauthorized");
        uint256 _fee = totalFeeAccummulated;
        require(_fee > 0, "Fee: No fees to withdraw");
        totalFeeAccummulated = 0;
        payable(receiver).transfer(_fee);
    }

    function MulDiv(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        require(c > 0, "Fee: Division by zero");
        return (a * b) / c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    constructor(
        address _protocolFeeReceiver,
        address _auctionContract,
        address _globalPermissionManager,
        uint256 _stakeAmount
    ) {
        require(_globalPermissionManager != address(0), "Invalid global permission manager address");

        globalPermissionManager = _globalPermissionManager;
        receiver = _protocolFeeReceiver;
        auctionContract = _auctionContract;
        stakeAmountRequired = _stakeAmount;
    }

    modifier onlyauction() {
        require(msg.sender == address(auctionContract), "Fee: unauthorized");
        _;
    }

    receive() external payable {
        totalFeeAccummulated += msg.value;
    }
}
