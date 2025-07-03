// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMerkleVerifier {
    event SetRoot(string _brand, address owner);
    event AddedLeaf(string lastProof, string newLeaf);
    event ChangedSyncer(address syncer);

    // External Read Functions
    function root() external view returns (bytes32);

    function brand() external view returns (string memory);

    function initialize(
        string memory _brand,
        string memory _root,
        address _syncer,
        address _owner
    ) external;

    function getProof() external view returns (bytes32[] memory);

    function registryAddress() external view returns (address);

    function syncer() external view returns (address);

    function owner() external view returns (address);

    function isleaf(string memory leaf) external view returns (bool);

    // External Write Functions
    function setSyncer(address _syncer) external;

    function setRegistry(address _registry) external;

    function setRoot(string memory _root) external;

    function addLeaf(string memory leaf) external;

    function removeLeaf(string memory leaf) external;
}
