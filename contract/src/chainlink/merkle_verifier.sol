// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
//cloned

// import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {MerkelProofs} from "../libs/merkle-proofs.sol";

contract MerkleVerifier {
    // Verifies a Merkle proof for a given root and leaf

    // structs

    // error
    error LeafNotFound(string leaf);
    error NotSyncer(address sender);

    // events
    event leafRemoved(bytes32 leaf);
    event SetRoot(string _brand, address owner);
    event AddedLeaf(string lastProof, string newLeaf);
    event ChangedSyncer(address syncer);
    event leafAdded(bytes32 leaf);
    // storage

    address registryAddress;
    address messengerAddress;
    bytes32 public root;
    string public brand;
    bytes32[] proof;
    address syncer;
    address owner;

    //mappings

    mapping(bytes32 => bool) private isLeaf;

    // constructor
    constructor() {
        owner = msg.sender;
    }

    // modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "merkle_verifier: Not owner");
        _;
    }

    modifier onlySyncer() {
        require(syncer == msg.sender, NotSyncer(msg.sender));
        _;
    }
    modifier onlyRegistry() {
        require(
            address(registryAddress) == msg.sender,
            "MerkleVerifier: wrong caller"
        );
        _;
    }

    function initialize(
        string memory _brand,
        string memory _root,
        address _syncer,
        address _owner
    ) public {
        brand = _brand;

        root = keccak256(abi.encodePacked(_root));
        syncer = _syncer;
        owner = _owner;
    }

    function getProof() public view returns (bytes32[] memory) {
        return proof;
    }

    function setSyncer(address _syncer) public onlyRegistry {
        syncer = _syncer;
        emit ChangedSyncer(_syncer);
    }

    function setMessenger(address _messenger) public onlyOwner {
        messengerAddress = _messenger;
    }

    function setRegistry(address _registry) public onlyOwner {
        registryAddress = _registry;
    }

    // function verifyProof(string memory leaf) public returns (bool) {
    //     // 3 mains leaves after root. (car, auction, bid)
    //     bytes32 computedHash = keccak256(abi.encodePacked(leaf));
    //     for (uint256 i = 0; i < proof.length; i++) {
    //         bytes32 proofElement = keccak256(abi.encodePacked(proof[i]));
    //         if (computedHash <= proofElement) {
    //             // Hash(current computed hash + current element of the proof)
    //             computedHash = keccak256(
    //                 abi.encodePacked(computedHash, proofElement)
    //             );
    //         } else {
    //             // Hash(current element of the proof + current computed hash)
    //             computedHash = keccak256(
    //                 abi.encodePacked(proofElement, computedHash)
    //             );
    //         }
    //     }
    //     // Check if the computed hash (root) is equal to the provided root
    //     if (proof.length == 1) {
    //         // If no proof is provided, we can only verify if the leaf is the root
    //         root = leaf;
    //         return true;
    //     }
    //     return computedHash == keccak256(abi.encodePacked(root));
    // }

    // set root only Car registrion
    // should we allow for reset? no
    function setRoot(string memory _root) public onlyRegistry {
        bytes32 roothash = keccak256(abi.encodePacked(_root));
        root = roothash;
        // changing root can trigger security concerns like editing user fields - not advisable
        emit SetRoot(brand, msg.sender);
    }

    // called from the prrof sync

    function addLeaf(string memory leaf) public onlySyncer {
        bytes32 leafHash = keccak256(abi.encodePacked(leaf));
        require(!isLeaf[leafHash], "MerkleVerifier: Already exist");
        proof.push(leafHash);
        //   bool computedHash = verifyFromRoot(proof, leaf);
        // verify
        //   require(computedHash, "MerkleVerifier: invalid leaf");
        // generate proof for leaf and mark true
        isLeaf[leafHash] = true;
        emit leafAdded(leafHash);
    }

    function removeLeaf(string memory leaf) public onlySyncer {
        bytes32 leafHash = keccak256(abi.encodePacked(leaf));
        require(isLeaf[leafHash], "MerkleVerifier: does not exist");
        popLeaf(leafHash);
        // pop removed leaf from array

        isLeaf[leafHash] = false;
        emit leafRemoved(leafHash);
    }

    function popLeaf(bytes32 leaf) internal {
        bytes32 _hash = leaf;
        uint256 proofLength = proof.length;
        require(proofLength > 0, "MerkleVerifier: tree is empty");
        for (uint256 i = 0; 1 < proofLength; i++) {
            if (proof[i] == _hash) {
                proof[i] = proof[proofLength - 1]; // make the proof to be removed the last element
                proof.pop();
                break;
            }
        }
    }

    function verifyFromRoot(
        bytes32[] memory _proof,
        string memory leaf
    ) internal view returns (bool) {
        return MerkelProofs.verify(_proof, root, leaf);
    }

    function isleaf(string memory leaf) external view returns (bool) {
        bytes32 _leafHash = keccak256(abi.encodePacked(leaf));
        bool leafState = verifyFromRoot(proof, leaf);
        return isLeaf[_leafHash] && leafState;
    }

    //     modifier onlySyncer() {
    //         require(msg.sender == address(syncer), "MerkleVerifier: unauthorized");
    //     }
}

// store every car brands merkle verifier.
// using that merkleVerifier we can verifier the brand. db state.
