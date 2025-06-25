// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
//cloned

contract MerkleVerifier {
    // Verifies a Merkle proof for a given root and leaf
    function verifyProof(bytes32 root, bytes32 leaf, bytes32[] calldata proof) external pure returns (bool) {
        // 3 mains leaves after root. (car, auction, bid)
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        // Check if the computed hash (root) is equal to the provided root
        return computedHash == root;
    }
}


// store every car brands merkle verifier. 
// using that merkleVerifier we can verifier the brand. db state. 
