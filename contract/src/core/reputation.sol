// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {PermissionModifiers} from "../libs/PermissionModifier.sol";
import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";

contract Reputation {
    using PermissionModifiers for address*

    // the whole idea is to have brands stake an amount to eth or usdc to used as maintamce fee and check fee
    // brands will be slashed penetalized if they go against rules

uint256 requireStake ;
address stakeToken; // address of the token used for staking, if is not eth
address _carRegistry; // address of the car registry contract
uint256 public stakeSlashed; // total amount slashed from brands

 bytes4 public constant SLASH  = bytes4(keccak256("slash(address,uint256)"));
 bytes4 public constant  WITHDRAW_SLASHED_ETH = bytes4(keccak256(" withdrawSlashedEth(uint256)"));
 bytes4 public constant  WITHDRAW_SLASHED_USDC = bytes4(keccak256("withslashedeth(uint256)"));
 bytes4 public constant  SET_STAKE_AMOUNT = bytes4(keccak256("stakeAmountset(uint256)"));


struct BrandStakeInfo{
     bool isActive;
     uint256 stakeAmount;
    uint256 stakeepoch;
}

mapping(address => BrandStakeInfo) public brandStakeInfo; // brand address => stake info
    function stake(address staker, bool isEth) external onlyCarRegistry{

        if(isEth){
            require(msg.value == requireStake, "Reputation: Insufficient stake amount");
            payable(staker).transfer(msg.value);

        }else {
            IERC20(stakeToken).transferFrom(staker, address(this), requireStake);

        }

        brandStakeInfo[staker] = BrandStakeInfo({
            isActive: true,
            stakeAmount: requireStake,
            stakeepoch: block.timestamp // + max wait period 
        });

    }

  // if state of off chain and onchain are different we slash 
  // admin and chainffunction 
  function slash(address staker, uint256 amount) external {
        require(brandStakeInfo[staker].isActive, "Reputation: Brand is not active");
        require(brandStakeInfo[staker].stakeAmount >= amount, "Reputation: Insufficient stake amount to slash");
        
        stakeSlashed += amount;
        brandStakeInfo[staker].stakeAmount -= amount;

        if (brandStakeInfo[staker].stakeAmount == 0) {
            brandStakeInfo[staker].isActive = false;
        }

  }


  function withdrawSlashedEth(uint256 amoount) public {

  }

   function withdrawSlashedusdc(uint256 amoount) public {

  }


    function stakeAmountset(uint256 amount) public {
        requireStake = amount;
    }

    constructor(uint256 _requireStake, address _stakeToken, address carRegistry) {
        stakeToken = _stakeToken;
        requireStake = _requireStake;
        _carRegistry = carRegistry;
    }

    modifier onlyCarRegistry() {
        require(msg.sender == address(_carRegistry), "Reputation: Caller is not the car registry");
        _;
    }
}