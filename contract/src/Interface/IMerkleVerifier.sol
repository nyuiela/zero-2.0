// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IMerkleVerifier {
    event SetRoot(string _brand, address owner);
    event AddedLeaf(string lastProof, string newLeaf);
    event ChangedSyncer(address syncer);
    function initialize(string memory _brand, string memory _root, address _syncer, address _owner) external;
    function getProof() external view returns (string[] memory);
    function setSyncer(address _syncer) external;
    function verifyProof(string memory leaf) external view returns (bool);
    function addLeave(string memory _leaf) external;
} 