// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface ISync {
    event Response(bytes32 indexed requestId, string state, bytes response, bytes err);
    event ChangeDON(bytes32 indexed donId, address owner);
    event ChangeRouter(address indexed router, address owner);
    event ChangeGasLimit(uint256 gas, address owner);
    function setDon(bytes32 _donId) external;
    function setRouter(address _router) external;
    function setGasLimit(uint32 _gas) external;
    function sendRequest(uint64 subscriptionId, string[] calldata args) external returns (bytes32 requestId);
} 