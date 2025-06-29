// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IFee {
    function feeOnPurchase(uint256 _cost, address buyer) external payable;
    function setFee(uint256 _fee) external;
    function setFeeReceiver(address _receiver) external;
    function withdrawFee() external;
}
