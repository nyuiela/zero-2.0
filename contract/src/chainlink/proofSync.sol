// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IMerkleVerifier {
    function verifyProof(bytes32 root, bytes32 leaf, bytes32[] calldata proof) external pure returns (bool);
}

contract ProofSync {
    // Errors
    error InvalidProof();
    error UnauthorizedSender();
    error ChainNotAllowListed();
    error ChainSyncFailed(address addr, string date);
    error ContractLocked(string reason);

    // Events
    event ProofSubmitted(address indexed submitter, string ipfsHash, bytes32 method);
    event ProofSynced(string ipfsHash, uint64[] chains);
    event ContractLockedEvent(string reason);
    event ContractUnlocked();
    event SyncPermissionGranted(address indexed syncer);
    event SyncPermissionRevoked(address indexed syncer);

    // State
    bytes32 public method = keccak256("METHOD");
    string public s_lastSubmittedProof;
    bool public locked;
    mapping(address => bool) public allowedSyncers;
    mapping(uint64 => bool) public chainsAllowed;
    address public owner;
    IMerkleVerifier public merkleVerifier;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "ProofSync: Not owner");
        _;
    }
    modifier onlyAllowedSyncers() {
        require(allowedSyncers[msg.sender], "ProofSync: Not allowed syncer");
        _;
    }
    modifier notLocked() {
        require(!locked, "ProofSync: Locked");
        _;
    }

    constructor(address _merkleVerifier) {
        owner = msg.sender;
        merkleVerifier = IMerkleVerifier(_merkleVerifier);
    }

    // Allow a syncer (Function/Automation) to sync proofs
    function allowSyncPermission(address syncer) external onlyOwner {
        allowedSyncers[syncer] = true;
        emit SyncPermissionGranted(syncer);
    }
    function revokeSyncPermission(address syncer) external onlyOwner {
        allowedSyncers[syncer] = false;
        emit SyncPermissionRevoked(syncer);
    }
    function allowChain(uint64 chainSelector) external onlyOwner {
        chainsAllowed[chainSelector] = true;
    }
    function revokeChain(uint64 chainSelector) external onlyOwner {
        chainsAllowed[chainSelector] = false;
    }

    // Lock/unlock contract
    function lockContract(string calldata reason) external onlyOwner {
        locked = true;
        emit ContractLockedEvent(reason);
    }
    function unlockContract() external onlyOwner {
        locked = false;
        emit ContractUnlocked();
    }

    // Submit a proof (ipfs hash) and sync across chains
    function sendProof(string calldata ipfsHash, bytes32 _method) external onlyAllowedSyncers notLocked {
        // Optionally: verify proof with Merkle root if needed
        s_lastSubmittedProof = ipfsHash;
        emit ProofSubmitted(msg.sender, ipfsHash, _method);
        // triggerSync(); // Optionally auto-trigger sync
    }

    // Trigger sync across allowed chains (stub, to be implemented with CCIP)
    function triggerSync(uint64[] calldata chainSelectors) external onlyAllowedSyncers notLocked {
        // For each chain, send the proof (integration with CCIP/messaging contract)
        // If fail, revert or emit error
        emit ProofSynced(s_lastSubmittedProof, chainSelectors);
    }


    function triggerReSync(uint64 chainSelector) external onlyAllowedSyncers notLocked {
        if (!chainsAllowed[chainSelector]) revert ChainNotAllowListed();
        // Re-send the last proof to the specified chain
        // If fail, revert or emit error
        emit ProofSynced(s_lastSubmittedProof, _toArray(chainSelector));
    }


    function _toArray(uint64 chainSelector) internal pure returns (uint64[] memory arr) {
        arr = new uint64[](1);
        arr[0] = chainSelector;
    }

    function setMerkleVerifier(address _verifier) external onlyOwner {
        merkleVerifier = IMerkleVerifier(_verifier);
    }
}