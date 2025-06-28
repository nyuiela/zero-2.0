// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IReputation {
    struct BrandStakeInfo {
        bool isActive;
        uint256 stakeAmount;
        uint256 stakeepoch;
        address staker;
    }
    function stake(string memory _brand, bool isEth) external payable;
    function slash(string memory _brand, uint256 amount) external;
    function withdrawSlashedEth(uint256 amount, address _receive) external;
    function withdrawSlashedusdc(uint256 amoount, address _receiver) external;
    function stakeAmountset(uint256 amount) external;
} 