// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
//cloned

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract MerkleVerifier is Initializable {
    // Verifies a Merkle proof for a given root and leaf

    // structs

    // error
    error LeafNotFound(string leaf);
    error NotSyncer(address sender);


    // events
    event SetRoot(string _brand, address owner);
    event AddedLeaf(string lastProof, string newLeaf);
    event ChangedSyncer(address syncer);
    // storage
    string public root;
    string public brand;
    string[] proof;
    address syncer;
    address owner;
    //mappings

    // constructor
    constructor() {}

    // modifier
    modifier onlyOwner() {
      require(msg.sender == owner, "merkle_verifier: Not owner");
      _;
    }

    modifier onlySyncer() {
      require(syncer == msg.sender, NotSyncer(msg.sender));
      _;
    }

    function initialize(string memory _brand, string memory _root, address _syncer,address _owner) public {
        brand = _brand;
        root = _root;
        syncer = _syncer;
        owner = _owner;
    }

    function getProof() public view returns (string[] memory) {
        return proof;
    }

    function setSyncer(address _syncer) public onlyOwner {
      syncer = _syncer;
      emit ChangedSyncer(_syncer);
    }

    function verifyProof(string memory leaf) public view returns (bool) {
        // 3 mains leaves after root. (car, auction, bid)
        bytes32 computedHash = keccak256(abi.encodePacked(leaf));
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = keccak256(abi.encodePacked(proof[i]));
            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        // Check if the computed hash (root) is equal to the provided root
        return computedHash == keccak256(abi.encodePacked(root));
    }

    // function setRoot(string memory _root) public /* only permissioned */ {
    //     root = _root;
    //     // changing root can trigger security concerns like editing user fields - not advisable
    //     emit SetRoot(brand, msg.sender);
    // }

    function addLeave(string memory _leaf) external onlySyncer /* only permissioned user */ {
        // verifier proof using Function

        proof.push(_leaf);

        //check if leaf exists
        require(verifyProof(_leaf), LeafNotFound(_leaf));
        emit AddedLeaf(proof[proof.length - 1], _leaf);
    }
}

// store every car brands merkle verifier.
// using that merkleVerifier we can verifier the brand. db state.
