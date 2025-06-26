// SPDX-License-identifier: MIT
pragma solidity 0.8.28;
import {Test} from "forge-std/Test.sol";
import {Registry} from "../src/core/registry.sol";

import {ProofSync} from "../src/chainlink/proofSync.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {Profile} from "../src/core/profile.sol";
import {Reputation} from "../src/core/reputation.sol";
// import {state} from "../src/core/reputation.sol";
import {Oracle} from "../src/oracle/Oracle.sol";
import {BrandPermissionManager} from "../src/permission/BrandPermissionManager.sol";
import {PermissionManager} from "../src/permission/PermissionManager.sol";
contract RegistryTest is Test {
  Registry registry;
  Profile profile;
  State state;
  ChainFunction chainFunction;
  CrossToken ccip;
  MerkleVerifier merkleVerifier;
  Oracle oracle;
  ProofSync syncer;
  PermissionManager permission;

  address profileAddr;
  address stateAddr;
  address chainFunctionAddr;
  address ccipAddr;
  address merkleVerifierAddr;
  address reputationAddr;
  address oracleAddr;
  address syncerAddr;

  uint256 REQUIRED_STAKE = 30;


  function setUp() {
        profile = new Profile(
          address(registry),
          address(permission)
        );

        permission = new PermissionManager();
        state = new State(address(profile));
        ccip = new CrossToken();
        merkleVerifier = new MerkleVerifier();
        merkleVerifier.initialize("brand");

        // address _oracleImplementation
        // address _permissionManagerImplementation
        // address _globalPermissionManager
        oracle = new Oracle();
        syncer = new ProofSync(address(merkleVerifier));

        //         uint256 _requireStake,
        // address _stakeToken,
        // address carRegistry,
        // address _permissionManagerImplementation,
        // address _globalPermissionManager
        reputation = Reputation(REQUIRED_STAKE, , address(registry), address(), address(permission));
    registry = new Registry(address(profile), address(state), address(chainFunction), address(ccip), address(merkleVerifier), address(reputation), address(oracle), address(syncer));
  }
  // function testRegistration() {}
  // function testActivation() {}
}