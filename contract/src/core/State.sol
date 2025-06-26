//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract StateManager {
    // // structs
    // struct BrandInfo {
    //   string state;
    //   uint256 date;
    // }

    // errors
    error UserNotPermitted();
    error ContractLockedError();
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
    // get all function/ccip/cloned contracts.

    // onlyOnwer or register contract can cal  l this
    function initiate(string memory _brand) public /* onlyOnwer */ {
        // require()

        if (!true) {
            revert ActivationFailed(_brand, msg.sender);
        }
        emit Activated(_brand);
    }

    function setState(string memory _brand, string memory _new_state) public /* permissioned users */ {
        // check the brand permission and check authorized users who needs to do that.
        // require(msg.sender, )
        require(!locked[_brand], ContractLockedError());
        states[_brand] = _new_state;

        emit ChangeState(_brand, _new_state, msg.sender);
    }

    // only some selected few can lock a contract e.g Chainlink Function

    function lockContract(string memory _brand, string memory _reason) public /* permissioned user */ {
        require(!locked[_brand], ContractLockedError());
        locked[_brand] = true;
        emit ContractLocked(_brand, _reason, msg.sender);
    }

    function unlockContract(string memory _brand, string memory _reason) public /* permissioned user */ {
        require(locked[_brand], ContractLockedError());
        locked[_brand] = false;
        // unlock from contract;
        emit ContractUnlocked(_brand, _reason, msg.sender);
    }

    function setProfile(address _profile) public /* onlyOwner */ {
      profile = _profile;
      emit UpdatedProfileContract(_profile);
    }

    // what is the changes 
}
