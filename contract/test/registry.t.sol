// SPDX-License-identifier: MIT
pragma solidity 0.8.28;
import {Test} from "forge-std/Test.sol";
import {CarRegistry} from "../src/core/registry.sol";

import {ProofSync} from "../src/chainlink/proofSync.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {Profile} from "../src/core/profile.sol";
import {Reputation} from "../src/core/reputation.sol";
import {StateManager} from "../src/core/State.sol";
import {OracleMaster} from "../src/oracle/Oracle.sol";
import {CarOracle} from "../src/oracle/CarOracle.sol";
import {BrandPermissionManager} from "../src/permission/BrandPermissionManager.sol";
import {PermissionManager} from "../src/permission/PermissionManager.sol";
import {UsdcToken} from "./mocks/IUSDC.sol";
import {Sync} from "../src/chainlink/function.sol";
contract RegistryTest is Test {
  CarRegistry registry;
  Profile profile;
  StateManager state;
  Sync chainFunction;
  CrossToken ccip;
  MerkleVerifier merkleVerifier;
  OracleMaster oracle;
  ProofSync syncer;
  PermissionManager permission;
  CarOracle carOracle;
  BrandPermissionManager brandPermission;
  UsdcToken usdc;
  Reputation reputation;

  address profileAddr;
  address stateAddr;
  address chainFunctionAddr;
  address ccipAddr;
  address merkleVerifierAddr;
  address reputationAddr;
  address oracleAddr;
  address syncerAddr;

  uint256 REQUIRED_STAKE = 30;
  address constant ROUTER = address(2);
  address constant LINK_TOKEN = address(2);



  function setUp() public {

        usdc = new UsdcToken();

        permission = new PermissionManager();
        brandPermission = new BrandPermissionManager();
        ccip = new CrossToken(ROUTER, LINK_TOKEN);
        merkleVerifier = new MerkleVerifier();
        merkleVerifier.initialize("brand", "000", address(0), address(0));

        // address _oracleImplementation
        // address _permissionManagerImplementation
        // address _globalPermissionManager
        profile = new Profile(
          address(registry),
          address(permission)
        );
        state = new StateManager(address(profile));
        oracle = new OracleMaster(
          address(carOracle),
          address(brandPermission),
          address(permission)
        );
        syncer = new ProofSync(address(merkleVerifier));

        //         uint256 _requireStake,
        // address _stakeToken,
        // address carRegistry,
        // address _permissionManagerImplementation,
        // address _globalPermissionManage r
        reputation = new Reputation(REQUIRED_STAKE, address(usdc), address(registry), address(permission));
        registry = new CarRegistry(address(profile), address(state), address(chainFunction), address(ccip), address(merkleVerifier), payable(address(reputation)), address(oracle), address(syncer));
  }
  // function testRegistration() {}
  // function testActivation() {}
}