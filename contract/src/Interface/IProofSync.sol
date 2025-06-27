// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IProofSync {
    event ProofSubmitted(address indexed submitter, string ipfsHash, bytes32 method);
    event ProofSynced(string ipfsHash, uint64[] chains);
    event ContractLockedEvent(string reason);
    event ContractUnlocked();
    event SyncPermissionGranted(address indexed syncer);
    event SyncPermissionRevoked(address indexed syncer);
    function allowSyncPermission(address syncer) external;
    function revokeSyncPermission(address syncer) external;
    function allowChain(uint64 chainSelector) external;
    function revokeChain(uint64 chainSelector) external;
    function lockContract(string calldata reason) external;
    function unlockContract() external;
    function sendProof(string calldata ipfsHash, bytes32 _method) external;
    function triggerSync(uint64[] calldata chainSelectors) external;
    function triggerReSync(uint64 chainSelector) external;
    function setMerkleVerifier(address _verifier) external;
} 