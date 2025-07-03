// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library MerkelProofs {
    // proof lib to verify that a given leaf is
    // oart of a merkle tree with a known root

    // verify the proof
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        string memory leaf
    ) internal pure returns (bool) {
        return root == processProof(proof, leaf);
    }

    // where the procces logic to veriffy the proof happens
    // will return the root after checking
    function processProof(
        bytes32[] memory proof,
        string memory leaf
    ) internal pure returns (bytes32) {
        // using kaleels method

        bytes32 computedHash = keccak256(abi.encodePacked(leaf));
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i]; // composistion of proof
            if (computedHash < proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement));
            }
        }

        return computedHash;
    }
}
