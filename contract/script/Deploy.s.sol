// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "../lib/foundry-chainlink-toolkit/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "forge-std/Script.sol";
import {PermissionManager} from "../src/Permission/PermissionManager.sol";
import {BrandPermissionManager} from "../src/Permission/BrandPermissionManager.sol";
import {CarRegistry} from "../src/core/registry.sol";
import {Profile} from "../src/core/profile.sol";
import {Reputation} from "../src/core/reputation.sol";
import {StateManager} from "../src/core/State.sol";
import {Auction} from "../src/core/auction.sol";
import {Fee} from "../src/core/fee.sol";
import {OracleMaster} from "../src/oracle/Oracle.sol";
import {CarOracle} from "../src/oracle/CarOracle.sol";
import {InitFunction} from "../src/chainlink/init_function.sol";
import {ProofSync} from "../src/chainlink/proofSync.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {Sync} from "../src/chainlink/sync_function.sol";
import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";
import {Messenger} from "../src/chainlink/messenging.sol";
import {StateCheckFunction} from "../src/chainlink/state_check_function.sol";

contract DeployScript is Script {
    // Base Network Addresses
    address constant _BASE_ETH_USD_FEED =
        0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address constant _BASE_USDC_USD_FEED =
        0x7e860098F58bBFC8648a4311b374B1D669a2bc6B;
    address constant _BASE_USDC_TOKEN =
        0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant _BASE_ROUTER = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
    address constant _BASE_LINK_TOKEN =
        0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
    address constant _BASE_FUNCTION_ROUTER =
        0xf9B8fc078197181C841c296C876945aaa425B278;
    bytes32 constant _BASE_FUNCTION_DON_ID =
        0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;

    // Contracts
    PermissionManager public permissionManager;
    BrandPermissionManager public brandPermissionManager;
    CarRegistry public carRegistry;
    Profile public profile;
    Reputation public reputation;
    StateManager public stateManager;
    Auction public auction;
    Fee public fee;
    OracleMaster public oracleMaster;
    CarOracle public carOracle;
    InitFunction public initFunction;
    ProofSync public proofSync;
    MerkleVerifier public merkleVerifier;
    CrossToken public ccip;
    Sync public syncFunction;
    ZeroNFT public zeroNFT;
    Messenger public messenger;
    StateCheckFunction public stateCheckFunction;

    address deployer;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying contracts to Base network...");
        console.log("Deployer address:", deployer);

        deployCoreContracts();
        deployOracleAndChainlinkContracts();
        deployCarSystem(deployer);
        deployAuxiliaryContracts();
        configurePostDeployment(deployer);

        logDeploymentSummary();

        vm.stopBroadcast();
    }

    function deployCoreContracts() internal {
        permissionManager = new PermissionManager();
        brandPermissionManager = new BrandPermissionManager();
        profile = new Profile(address(permissionManager));
        stateManager = new StateManager(
            address(profile),
            address(permissionManager)
        );
        merkleVerifier = new MerkleVerifier();
        syncFunction = new Sync();
        console.log("Core contracts deployed.");
    }

    function deployOracleAndChainlinkContracts() internal {
        carOracle = new CarOracle();
        oracleMaster = new OracleMaster(
            address(carOracle),
            address(brandPermissionManager),
            address(permissionManager)
        );
        ccip = new CrossToken(_BASE_ROUTER, _BASE_LINK_TOKEN);
        messenger = new Messenger(
            _BASE_ROUTER,
            _BASE_LINK_TOKEN,
            address(merkleVerifier)
        );
        proofSync = new ProofSync(
            address(merkleVerifier),
            payable(address(messenger))
        );
        console.log("Oracle and Chainlink contracts deployed.");
    }

    function deployCarSystem(address _deployer) internal {
        fee = new Fee(address(0), address(0), address(permissionManager), 10);
        reputation = new Reputation(
            1,
            _BASE_USDC_TOKEN,
            address(0), //----set later
            address(permissionManager)
        );

        carRegistry = new CarRegistry(
            address(profile),
            address(stateManager),
            address(syncFunction),
            address(ccip),
            address(merkleVerifier),
            payable(address(reputation)),
            address(oracleMaster),
            address(proofSync)
        );

        stateCheckFunction = new StateCheckFunction(
            address(stateManager),
            payable(carRegistry)
        );
        initFunction = new InitFunction(address(carRegistry));
        // address(stateManager),
        zeroNFT = new ZeroNFT(
            address(oracleMaster),
            address(reputation),
            address(carRegistry),
            address(0)
        );

        auction = new Auction(
            payable(carRegistry),
            address(zeroNFT),
            address(oracleMaster),
            _BASE_ETH_USD_FEED,
            _BASE_USDC_USD_FEED,
            _deployer
        );

        console.log("Car system contracts deployed.");
    }

    function deployAuxiliaryContracts() internal {
        vm.makePersistent(address(permissionManager));
        vm.makePersistent(address(brandPermissionManager));
        vm.makePersistent(address(carOracle));
        vm.makePersistent(address(oracleMaster));
        vm.makePersistent(address(profile));
        vm.makePersistent(address(stateManager));
        vm.makePersistent(address(merkleVerifier));
        vm.makePersistent(address(proofSync));
        vm.makePersistent(address(ccip));
        vm.makePersistent(address(messenger));
        vm.makePersistent(address(syncFunction));
        vm.makePersistent(address(fee));
        vm.makePersistent(address(reputation));
        vm.makePersistent(address(carRegistry));
        vm.makePersistent(address(stateCheckFunction));
        vm.makePersistent(address(initFunction));
        vm.makePersistent(address(zeroNFT));
        vm.makePersistent(address(auction));
    }

    function configurePostDeployment(address _deployer) internal {
        carRegistry.setInitFunction(address(initFunction));
        profile.setRegistry(address(carRegistry));
        zeroNFT.setAuctionContract(address(auction));
        initFunction.transferOwnership(address(carRegistry));
        proofSync.setMessenger(payable(messenger));

        allowDestinationChains();
        grantPermissions(_deployer);
        initFunction.setDon(_BASE_FUNCTION_DON_ID);

        console.log("Post-deployment configuration complete.");
    }

    function allowDestinationChains() internal {
        ccip.allowlistDestinationChain(3676871237479449268, true); // sonic
        ccip.allowlistDestinationChain(222782988166878823, true); // hedera
        ccip.allowlistDestinationChain(16015286601757825753, true); // eth
        ccip.allowlistDestinationChain(14767482510784806043, true); // avalanche
    }

    function grantPermissions(address dep_loyer) internal {
        address permissionAddress = 0xf0830060f836B8d54bF02049E5905F619487989e;

        // Grant all permissions from PermissionManager
        bytes4[] memory permissions = new bytes4[](20);
        bytes4[] memory registryPermissions = new bytes4[](20);
        bytes4[] memory statecalls = new bytes4[](2);

        statecalls[0] = profile.updateState.selector;
        statecalls[1] = profile.lockBrand.selector;
        statecalls[2] = profile.unlockBrand.selector;

        permissions[0] = oracleMaster.registerCarBrand.selector;
        permissions[1] = oracleMaster.updateOracle.selector;
        permissions[2] = oracleMaster.deactivateOracle.selector;
        permissions[3] = oracleMaster.reactivateOracle.selector;
        permissions[4] = oracleMaster.batchUpdatePrices.selector;
        permissions[5] = oracleMaster.incrementProductCount.selector;
        permissions[6] = oracleMaster.decrementProductCount.selector;

        permissions[7] = reputation.SLASH();
        permissions[8] = reputation.WITHDRAW_SLASHED_ETH();
        permissions[9] = reputation.WITHDRAW_SLASHED_USDC();
        permissions[10] = reputation.SET_STAKE_AMOUNT();

        permissions[11] = fee.SET_FEE();
        permissions[12] = fee.SET_FEE_RECEIVER();
        permissions[13] = fee.WITHDRAW_FEE();

        permissions[14] = profile.UPDATESTATE();
        permissions[15] = profile.LOCKBRAND();
        permissions[16] = profile.UNLOCKBRAND();

        permissions[17] = stateManager.SET_STATE();
        permissions[18] = stateManager.LOCK_CONTRACT();
        permissions[19] = stateManager.UNLOCK_CONTRACT();

        registryPermissions[0] = stateManager.INITIATE();
        registryPermissions[1] = profile.UPDATESTATE();
        registryPermissions[2] = profile.LOCKBRAND();
        registryPermissions[3] = profile.UNLOCKBRAND();
        registryPermissions[4] = stateManager.SET_STATE();
        registryPermissions[5] = stateManager.LOCK_CONTRACT();
        registryPermissions[6] = stateManager.UNLOCK_CONTRACT();
        registryPermissions[7] = stateManager.INITIATE();

        permissionManager.grantBatchPermissions(
            permissionAddress,
            permissions,
            block.timestamp + 365 days
        );
        permissionManager.grantBatchPermissions(
            dep_loyer,
            permissions,
            block.timestamp + 365 days
        );
        permissionManager.grantBatchPermissions(
            address(carRegistry),
            registryPermissions,
            block.timestamp + 365 days
        );
        permissionManager.grantBatchPermissions(
            address(stateManager),
            statecalls,
            block.timestamp + 365 days
        );

        console.log("Permissions granted to:", permissionAddress);
    }

    function logDeploymentSummary() internal view {
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network= Base");
        console.log("Deployer=", deployer);
        console.log(
            "NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS=",
            address(permissionManager)
        );
        console.log(
            "NEXT_PUBLIC_BRAND_PERMISSION_MANAGER_ADDRESS=",
            address(brandPermissionManager)
        );
        console.log("NEXT_PUBLIC_CAR_ORACLE_ADDRESS=", address(carOracle));
        console.log(
            "NEXT_PUBLIC_ORACLE_MASTER_ADDRESS=",
            address(oracleMaster)
        );
        console.log("NEXT_PUBLIC_PROFILE_ADDRESS=", address(profile));
        console.log("NEXT_PUBLIC_STATEMANAGER_ADDRESS=", address(stateManager));
        console.log("NEXT_PUBLIC_INITFUNCTION_ADDRESS=", address(initFunction));
        console.log(
            "NEXT_PUBLIC_MERKLEVERIFIER_ADDRESS=",
            address(merkleVerifier)
        );
        console.log("NEXT_PUBLIC_PROOFSYNC_ADDRESS=", address(proofSync));
        console.log("NEXT_PUBLIC_CROSS_TOKEN_ADDRESS=", address(ccip));
        console.log("NEXT_PUBLIC_SYNCFUNCTION_ADDRESS=", address(syncFunction));
        console.log("NEXT_PUBLIC_FEE=", address(fee));
        console.log("NEXT_PUBLIC_REPUTATION_ADDRESS=", address(reputation));
        console.log("NEXT_PUBLIC_CAR_REGISTRY_ADDRESS=", address(carRegistry));
        console.log("NEXT_PUBLIC_ZERO_NFT_ADDRESS=", address(zeroNFT));
        console.log("NEXT_PUBLIC_AUCTION_ADDRESS=", address(auction));
        console.log(
            "NEXT_PUBLIC_STATECHECKFUNCTION_ADDRESS=",
            address(stateCheckFunction)
        );
        console.log("NEXT_PUBLIC_MESSENGER_ADDRESS=", address(messenger));
        console.log("=== DEPLOYMENT COMPLETE ===\n");
    }
}

///with the state contract should permsion to call the the profile contract
