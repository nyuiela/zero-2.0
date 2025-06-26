// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IStateManager {
    event Activated(string _brand);
    event ChangeState(string brand, string new_state, address owner);
    event ContractLocked(string brand, string reason, address owner);
    event ContractUnlocked(string brand, string reason, address owner);
    event UpdatedProfileContract(address profile);
    function initiate(string memory _brand) external;
    function setState(string memory _brand, string memory _new_state) external;
    function lockContract(string memory _brand, string memory _reason) external;
    function unlockContract(string memory _brand, string memory _reason) external;
    function setProfile(address _profile) external;
} 