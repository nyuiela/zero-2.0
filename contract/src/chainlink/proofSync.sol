// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Messenger} from "./messenging.sol";
import {IMerkleVerifier} from "../interface/IMerkleVerifier.sol";

contract ProofSync {
    // Errors
    error InvalidProof();
    error UnauthorizedSender();
    error ChainNotAllowListed();
    error ChainSyncFailed(address addr, string date);
    error ContractLocked(string reason);

    // Events
    event ProofSubmitted(address indexed submitter, string ipfsHash, bytes32 method);
    event ProofSynced(string ipfsHash, uint64[] chains, bytes32[] messageIds);
    event ContractLockedEvent(string reason);
    event ContractUnlocked();
    event SyncPermissionGranted(address indexed syncer);
    event SyncPermissionRevoked(address indexed syncer);

    // State
    Messenger public messenger;
    bytes32 public method = keccak256("METHOD");
    string public s_lastSubmittedProof;
    bool public locked;
    mapping(address => bool) public allowedSyncers;
    mapping(uint64 => bool) public chainsAllowed;
    mapping(uint64 => address) public receivers;
    address public owner;
    IMerkleVerifier public merkleVerifier;
    uint64[] public chainSelectors;

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

    constructor(address _merkleVerifier, address payable _messenger) {
        owner = msg.sender;
        merkleVerifier = IMerkleVerifier(_merkleVerifier);
         messenger = Messenger(_messenger);
    }

    function setMessenger(address payable _messenger) external onlyOwner {
        messenger = Messenger(_messenger);
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

    function allowChain(uint64 _chainSelector, address _receiver) external onlyOwner {
        chainsAllowed[_chainSelector] = true;
         chainSelectors.push(_chainSelector);
         receivers[_chainSelector] = _receiver;
    }

    function revokeChain(uint64 chainSelector) external onlyOwner {
        chainsAllowed[chainSelector] = false;
         for (uint256 i = 0; i < chainSelectors.length; i++) {
               if (chainSelectors[i] == chainSelector) {
                  chainSelectors[i] = chainSelectors[chainSelectors.length - 1];
                  chainSelectors.pop();
                  break;
               }
         }
         receivers[chainSelector] = address(0);
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
        triggerSync();
        s_lastSubmittedProof = ipfsHash;
        emit ProofSubmitted(msg.sender, ipfsHash, _method);
        // triggerSync(); // Optionally auto-trigger sync
    }

    // Trigger sync across allowed chains (stub, to be implemented with CCIP)
    function triggerSync() public onlyAllowedSyncers notLocked {
        // For each chain, send the proof (integration with CCIP/messaging contract)
        // If fail, revert or emit error
      bytes32[] memory msgId = new bytes32[](chainSelectors.length);
        if (chainSelectors.length == 0) revert ChainNotAllowListed();
        for (uint256 i = 0; i < chainSelectors.length; i++) {
            uint64 chainSelector = chainSelectors[i];
            if (!chainsAllowed[chainSelector]) revert ChainNotAllowListed();
            // Here you can add logic to verify the proof against a Merkle root if required
            bytes32 messageId = messenger.sendMessagePayLINK(chainSelector,receivers[chainSelector], s_lastSubmittedProof);
            msgId[i] = messageId;
        }
         // Add & Verify the proof using the Merkle verifier
        merkleVerifier.addLeave(s_lastSubmittedProof);
        emit ProofSynced(s_lastSubmittedProof, chainSelectors, msgId);
    }

    function triggerReSync(uint64 chainSelector) external onlyAllowedSyncers notLocked {
        if (!chainsAllowed[chainSelector]) revert ChainNotAllowListed();
        // Re-send the last proof to the specified chain
        // If fail, revert or emit error
        bytes32 messageId = messenger.sendMessagePayLINK(chainSelector,receivers[chainSelector], s_lastSubmittedProof);
        bytes32[] memory _messageIds = new bytes32[](1);
        _messageIds[0] = messageId;
        emit ProofSynced(s_lastSubmittedProof, _toArray(chainSelector), _messageIds);
    }

    function _toArray(uint64 chainSelector) internal pure returns (uint64[] memory arr) {
        arr = new uint64[](1);
        arr[0] = chainSelector;
    }

    function setMerkleVerifier(address _verifier) external onlyOwner {
        merkleVerifier = IMerkleVerifier(_verifier);
    }
}
