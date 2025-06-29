// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PermissionModifiers} from "../libs/PermissionModifier.sol";
import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Reputation {
    using PermissionModifiers for address;

    // the whole idea is to have brands stake an amount to eth or usdc to used as maintamce fee and check fee
    // brands will be slashed penetalized if they go against rules

    uint256 requireStake;
    address stakeToken; // address of the token used for staking, if is not eth
    address _carRegistry; // address of the car registry contract
    uint256 public stakeSlashed; // total amount slashed from brands
   // address public permissionManagerImplementation;
    address public globalPermissionManager;

    bytes4 public constant SLASH = bytes4(keccak256("slash(address,uint256)"));
    bytes4 public constant WITHDRAW_SLASHED_ETH = bytes4(keccak256(" withdrawSlashedEth(uint256)"));
    bytes4 public constant WITHDRAW_SLASHED_USDC = bytes4(keccak256("withslashedeth(uint256)"));
    bytes4 public constant SET_STAKE_AMOUNT = bytes4(keccak256("stakeAmountset(uint256)"));

    struct BrandStakeInfo {
        bool isActive;
        uint256 stakeAmount;
        uint256 stakeepoch;
        address staker;
    }

    mapping(string => BrandStakeInfo) public brandStakeInfo; // brand address => stake info

    constructor(
        uint256 _requireStake,
        address _stakeToken,
        address carRegistry,
        address _globalPermissionManager
    ) {
        stakeToken = _stakeToken;
        requireStake = _requireStake;
        _carRegistry = carRegistry;
      //  permissionManagerImplementation = _permissionManagerImplementation;
        globalPermissionManager = _globalPermissionManager;
    }


    function stake(string memory _brand, bool isEth) external payable onlyCarRegistry {
        if (isEth) {
            require(msg.value == requireStake, "Reputation: Insufficient stake amount");
            payable(address(this)).transfer(msg.value);
        } else {
            // IERC20(stakeToken).transferFrom(_brand, address(this), requireStake);
        }

        brandStakeInfo[_brand] = BrandStakeInfo({
            isActive: true,
            stakeAmount: requireStake,
            stakeepoch: block.timestamp, // + max wait period
            staker: msg.sender
        });
    }

    // if state of off chain and onchain are different we slash
    // admin and chainffunction
    function slash(string memory _brand, uint256 amount) external {
        require(globalPermissionManager.hasPermission(msg.sender, SLASH), "Reputation: Unauthorized");

        // Check if the brand is active and has sufficient stake
        // which contract can call this ??
        require(brandStakeInfo[_brand].isActive, "Reputation: Brand is not active");
        require(brandStakeInfo[_brand].stakeAmount >= amount, "Reputation: Insufficient stake amount to slash");

        stakeSlashed += amount;
        brandStakeInfo[_brand].stakeAmount -= amount;

        if (brandStakeInfo[_brand].stakeAmount == 0) {
            brandStakeInfo[_brand].isActive = false;
        }
    }

    function withdrawSlashedEth(uint256 amount, address _receive) public {
        require(globalPermissionManager.hasPermission(msg.sender, WITHDRAW_SLASHED_ETH), "Reputation: Unauthorized");
        uint256 balance = address(this).balance;
        require(balance >= amount, "Reputation: Insufficient balance to withdraw");
        stakeSlashed -= amount;
        payable(_receive).transfer(amount);
    }

    function withdrawSlashedusdc(uint256 amoount, address _receiver) public {
        require(globalPermissionManager.hasPermission(msg.sender, WITHDRAW_SLASHED_USDC), "Reputation: Unauthorized");
        uint256 balance = IERC20(stakeToken).balanceOf(address(this));
        require(balance >= amoount, "Reputation: Insufficient balance to withdraw");
        stakeSlashed -= amoount;
        IERC20(stakeToken).transfer(_receiver, amoount);
    }

    function stakeAmountset(uint256 amount) public {
        require(globalPermissionManager.hasPermission(msg.sender, SET_STAKE_AMOUNT), "Reputation: Unauthorized");
        requireStake = amount;
    }

    modifier onlyCarRegistry() {
        require(msg.sender == address(_carRegistry), "Reputation: Caller is not the car registry");
        _;
    }

    receive() external payable {
        // Accept ETH deposits
    }
}
