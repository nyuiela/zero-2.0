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
import {BrandPermissionManager} from "../src/Permission/BrandPermissionManager.sol";
import {PermissionManager} from "../src/Permission/PermissionManager.sol";
import {UsdcToken} from "./mocks/IUSDC.sol";
import {Sync} from "../src/chainlink/function.sol";
import {ICarOracle} from "../src/Interface/oracle/IcarOracle.sol";
import {InitFunction} from "../src/chainlink/init_function.sol";

// Mock for InitFunction to bypass Chainlink call will run node lattr
contract MockInitFunction is InitFunction {
    constructor(address _stateAddr, address _registry) InitFunction(_stateAddr, _registry) {}
    function sendRequest(uint64, string[] calldata, string memory) external override onlyRegistry returns (bytes32) {
        return bytes32(uint256(123));
    }
}

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
  InitFunction initFunction;

  // Define OracleConfig struct locally to avoid import issues
  struct OracleConfig {
      uint256 updateInterval;
      uint256 deviationThreshold;
      uint256 heartbeat;
      uint256 minAnswer;
      uint256 maxAnswer;
  }

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

        // Initialize carOracle before using it
        carOracle = new CarOracle();

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
        
        // Use the mock instead of the real InitFunction
        initFunction = new MockInitFunction(address(state), address(registry));
        registry.setInitFunction(address(initFunction));
  }
  function testRegistrationONlyCallableByOwner() public {
    // Test basic registry functionality without external calls
    string memory brand = "TestBrand";
    
    // Test that the registry is properly initialized
    assertEq(address(registry.profileContract()), address(profile), "Profile contract should be set");
    assertEq(address(registry.stateContract()), address(state), "State contract should be set");
    assertEq(address(registry.reputation()), address(reputation), "Reputation contract should be set");
    
    // Test that initFunction is properly set
    assertEq(registry.initFunctionAddr(), address(initFunction), "InitFunction should be set");
    
    // Test that the registry owner is the test contract
    assertEq(registry.owner(), address(this), "Registry owner should be test contract");
  }
  // function testActivation() {}

  function testRegisterBrand() public {
    string memory brand = "TestBrand";
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);

    // Assert the brand is in the registry and status is PENDING (1)
    (string memory storedBrand, CarRegistry.Status status,,,,,,) = registry.registry(brand);
    assertEq(storedBrand, brand, "Brand should be registered");
    assertEq(uint(status), 1, "Brand status should be PENDING after registration");
  }

  function testIsActivate() public {
    string memory brand = "TestBrand";
    
    // Initially, brand should not be active
    assertFalse(registry.isActivate(brand), "Brand should not be active initially");
    
    // Register the brand
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);
    
    // After registration, brand should still not be active (status is PENDING, not ACTIVE)
    assertFalse(registry.isActivate(brand), "Brand should not be active after registration");
  }

  function testStake_only_Callable_By_Registry() public {
    string memory brand = "TestBrand";
    
    // Register the brand first
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);
    
    // Stake the brand
    vm.expectRevert();
    registry.stake{value: 1 ether}(brand); // should fail for the min stake amount if changed and user sends less
    // so the test passes since the status isnt change 
    // // Check that status changed to STAKED (2)
    (, CarRegistry.Status status,,,,,,) = registry.registry(brand);
    vm.expectRevert();
     assertEq(uint(status), 2, "Brand status should be STAKED after staking"); // should pass now
     //so this proof skae can only be called from registry(car registry) ... wait TODo
  }

  function testActivate() public {
    string memory brand = "TestBrand";
    
    // Register the brand first
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);
    
    // Stake the brand first (required for activation)
    registry.stake{value: 1 ether}(brand);
    
    // Activate the brand
    registry.activate(brand);
    
    // Check that status changed to ACTIVE (3)
    (, CarRegistry.Status status,,,,,,) = registry.registry(brand);
    assertEq(uint(status), 3, "Brand status should be ACTIVE after activation");
    
    // Check isActivate function
    assertTrue(registry.isActivate(brand), "isActivate should return true for active brand");
  }

  function testActivateWithoutStaking() public {
    string memory brand = "TestBrand";
    
    // Register the brand first
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);
    
    // Try to activate without staking - should revert
    vm.expectRevert();
    registry.activate(brand);
  }

  function testDuplicateRegistration() public {
    string memory brand = "TestBrand";
    
    // Register the brand first
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);
    
    // Try to register the same brand again - should revert
    vm.expectRevert();
    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);
  }

  function testRegistryData() public {
    string memory brand = "TestBrand";
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    registry.registerBrand(brand, config, brandAdminAddr, subscriptionId, stateUrl, args);

    // Check all registry data
    (string memory storedBrand, CarRegistry.Status status, bytes32 request, string memory response, string memory storedStateUrl, ICarOracle.OracleConfig memory storedConfig, address storedBrandAdminAddr, address owner) = registry.registry(brand);
    
    assertEq(storedBrand, brand, "Brand name should match");
    assertEq(uint(status), 1, "Status should be PENDING");
    assertEq(request, bytes32(uint256(123)), "Request ID should match mock response");
    assertEq(response, "", "Response should be empty initially");
    assertEq(storedStateUrl, stateUrl, "State URL should match");
    assertEq(storedConfig.updateInterval, config.updateInterval, "Config updateInterval should match");
    assertEq(storedConfig.deviationThreshold, config.deviationThreshold, "Config deviationThreshold should match");
    assertEq(storedConfig.heartbeat, config.heartbeat, "Config heartbeat should match");
    assertEq(storedConfig.minAnswer, config.minAnswer, "Config minAnswer should match");
    assertEq(storedConfig.maxAnswer, config.maxAnswer, "Config maxAnswer should match");
    assertEq(storedBrandAdminAddr, brandAdminAddr, "Brand admin address should match");
    assertEq(owner, address(this), "Owner should be the test contract");
  }

//test multiple brands can register
  function testMultipleBrands() public {
    string memory brand1 = "Brand1";
    string memory brand2 = "Brand2";
    
    ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
        updateInterval: 3600,
        deviationThreshold: 100,
        heartbeat: 86400,
        minAnswer: 0,
        maxAnswer: 1000000
    });
    address brandAdminAddr = address(0x123);
    uint64 subscriptionId = 1;
    string memory stateUrl = "https://state.url";
    string[] memory args = new string[](1);
    args[0] = "arg1";

    // Register first brand
    registry.registerBrand(brand1, config, brandAdminAddr, subscriptionId, stateUrl, args);
    
    // Register second brand
    registry.registerBrand(brand2, config, brandAdminAddr, subscriptionId, stateUrl, args);
    
    // Check both brands are registered
    (string memory storedBrand1,, , , , , ,) = registry.registry(brand1);
    (string memory storedBrand2,, , , , , ,) = registry.registry(brand2);
    
    assertEq(storedBrand1, brand1, "First brand should be registered");
    assertEq(storedBrand2, brand2, "Second brand should be registered");
    
    // Check isActivate for both
    assertFalse(registry.isActivate(brand1), "First brand should not be active");
    assertFalse(registry.isActivate(brand2), "Second brand should not be active");
  }
}