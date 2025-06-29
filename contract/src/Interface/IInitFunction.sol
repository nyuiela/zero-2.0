// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IInitFunction {
    event Response(
        bytes32 indexed requestId,
        string state,
        bytes response,
        bytes err
    );
    event ChangeDON(bytes32 indexed donId, address owner);
    event ChangeRouter(address indexed router, address owner);
    event ChangeGasLimit(uint256 gas, address owner);

    function setDon(bytes32 _donId) external;

    function setRouter(address _router) external;

    function setGasLimit(uint32 _gas) external;

    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args,
        string memory _brand
    ) external returns (bytes32 requestId);

    function getResponse(
        string memory _brand
    ) external view returns (string memory);
}
