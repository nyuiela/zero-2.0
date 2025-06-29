//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";
import {PermissionModifiers} from "../libs/PermissionModifier.sol";

import {Profile} from "./profile.sol";

contract StateManager {
    using PermissionModifiers for address;

    // // structs
    // struct BrandInfo {
    //   string state;
    //   uint256 date;
    // }

    // errors
    error UserNotPermitted();
    error ContractLockedError(string brand);
    error ContractAlreadyUnlocked();
    error ActivationFailed(string brand, address owner);

    //events
    event Activated(string _brand);
    event ChangeState(string brand, string new_state, address owner);
    event ContractLocked(string brand, string reason, address owner);
    event ContractUnlocked(string brand, string reason, address owner);
    event UpdatedProfileContract(address profile);
    // mappings / storage

    mapping(string => string) public states;
    mapping(string => bool) public locked;
    address public profile;
    Profile public profileContract;
    // get all function/ccip/cloned contracts.

    // onlyOnwer or register contract can call this
    // call this function when Brand is registering

    // contructor
    constructor(address _profile) {
        profile = _profile;
        profileContract = Profile(profile);
    }

    bytes4 public constant SET_STATE = bytes4(keccak256("setState(string,string)"));
    bytes4 public constant LOCK_CONTRACT = bytes4(keccak256("lockContract(string,string)"));
    bytes4 public constant UNLOCK_CONTRACT = bytes4(keccak256("unlockContract(string,string)"));
    bytes4 public constant INITIATE = bytes4(keccak256("initiate(string)"));
    bytes4 public constant SET_PROFILE = bytes4(keccak256("setProfile(address)"));

    function initiate(string memory _brand) external /* OnlyRegister */ {
        // require()
        require(IPermissionManager(profile).hasPermission(msg.sender, INITIATE), "State: authorized");

        if (!true) {
            revert ActivationFailed(_brand, msg.sender);
        }
        emit Activated(_brand);
    }

    // PermissionedUser like Chainlink Function;
    function setState(string memory _brand, string memory _new_state) public /* permissioned users */ {
        require(IPermissionManager(profile).hasPermission(msg.sender, SET_STATE), "state: unauthorized");
        // check the brand permission and check authorized users who needs to do that.
        // require(msg.sender, )
        require(locked[_brand] == false, "state: brand is locked");
        states[_brand] = _new_state;
        // change state in profile
        profileContract.updateState(_brand, _new_state);
        emit ChangeState(_brand, _new_state, msg.sender);
    }

    // only some selected few can lock a contract e.g Chainlink Function

    function lockContract(string memory _brand, string memory _reason) public /* permissioned user */ {
        require(IPermissionManager(profile).hasPermission(msg.sender, LOCK_CONTRACT), "State: unauthorized");
        require(locked[_brand] == false, "state: brand is locked");
        locked[_brand] = true;
        profileContract.lockBrand(_brand);
        emit ContractLocked(_brand, _reason, msg.sender);
    }

    function unlockContract(string memory _brand, string memory _reason) public /* permissioned user */ {
        require(IPermissionManager(profile).hasPermission(msg.sender, UNLOCK_CONTRACT), "State: unauthorized");
        require(locked[_brand], "state: brand is locked");
        locked[_brand] = false;
        // unlock from contract;
        profileContract.unlockBrand(_brand);
        emit ContractUnlocked(_brand, _reason, msg.sender);
    }

    function setProfile(address _profile) public /* onlyOwner */ {
        require(IPermissionManager(profile).hasPermission(msg.sender, SET_PROFILE), "State: unauthorized");
        profile = _profile;
        emit UpdatedProfileContract(_profile);
    }

    function getState(string memory _brand) public view returns (string memory) {
        return states[_brand];
    }

    // what is the changes
}
