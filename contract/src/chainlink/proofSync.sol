// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract ProofSync {
  error InvalidProof(); // invalid proof check
  error UnauthorizedSender(); //invalid proof check
  error ChainNotAllowListed(); // this will conflict with chainlink ccip allowListed. 
  error ChainSyncFailed(address addr, string string);
  error ContractLocked(string reason);

  public bytes32 method = keccak256("METHOD");

  //idea when admin submits proof, the proof (ipfs hash) is sync between chains
  //idea what could go wrong? 

  //idea source chain is getting the proof through chainlink Functions
  //idea using the Function cron job, automation can then call the Function to check state every 24hr. 
  //idea after getting proof, proof sync happens across supported chains. 
  // should get report if failed. Using ccip: if fail: return error


  // private mapping() chainsAllowed;
  public string s_lastSubmittedProof; // this serves as the current state of the system. 
  public bool locked; // lock Before sync & unlock after sync.

  //modifiers
  modifier OnlyAllowedSyncers() {}; // including Function / Automation. 
  modifier notLocked() {
    require(!locked, "ProofSync::Locked");
    _;
  };
  //  functions
  function sendProof(string ipfsHash, bytes32 method); // onlyAllowedSyncers();
  function allowSyncPermission();
  function lockContract(); //onlyOwner / Syncers
  function triggerReSync(); // only one chain at a time
  function _reSync();
  function triggerSync(); 

}