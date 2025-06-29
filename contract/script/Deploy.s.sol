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
    address constant BASE_ETH_USD_FEED =
        0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address constant BASE_USDC_USD_FEED =
        0x7e860098F58bBFC8648a4311b374B1D669a2bc6B;
    address constant BASE_USDC_TOKEN =
        0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant BASE_ROUTER = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
    address constant BASE_LINK_TOKEN =
        0xE4aB69C077896252FAFBD49EFD26B5D171A32410;

    address constant BASE_FUNCTION_ROUTER =
        0xf9B8fc078197181C841c296C876945aaa425B278;
    bytes32 constant BASE_FUNCTION_DON_ID =
        0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000; // fun-base-sepolia-1
    //uint64 const ant BASE_CHAIN_SELECTOR_ID = 10344971235874465080; // Base Sepolia Chain ID
    uint256 constant AMOUNT = 1000000000000000000; // 1 LINK in wei
    // steps for deployment
    // 1. Deploy PermissionManager
    // 2. Deploy BrandPermissionManager
    // 3. Deploy Init_Function
    // 4. setDonId in Init_Function || router is hardcoded but we can set that.

    // Deployment addresses
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

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        //   uint256 deployerPrivateKey = vm.envUint("DEFAULT_ANVIL_KEY");
        //   address deployer = vm.addr(deployerPrivateKey);
        //   vm.makePersistent(deployer);
        console.log("Deploying contracts to Base network...");
        console.log("Deployer address:", deployer);

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);
        //   vm.createSelectFork(vm.rpcUrl("localchain"));
        //   vm.startBroadcast(deployerPrivateKey);

        IERC20(BASE_LINK_TOKEN).approve(address(this), type(uint256).max);
        // REPEAT

        // IERC20(BASE_LINK_TOKEN).transfer(BASE_ROUTER, type(uint256).max);
        // 1. Deploy Permission Manager
        console.log("Deploying PermissionManager...");
        permissionManager = new PermissionManager();
        console.log(
            "PermissionManager deployed at:",
            address(permissionManager)
        );

        // 2. Deploy Brand Permission Manager
        console.log("Deploying BrandPermissionManager...");
        brandPermissionManager = new BrandPermissionManager();
        console.log(
            "BrandPermissionManager deployed at:",
            address(brandPermissionManager)
        );

        // 3. Deploy Car Oracle
        console.log("Deploying CarOracle...");
        carOracle = new CarOracle();
        console.log("CarOracle deployed at:", address(carOracle));

        // 4. Deploy Oracle Master
        console.log("Deploying OracleMaster...");
        oracleMaster = new OracleMaster(
            address(carOracle),
            address(brandPermissionManager),
            address(permissionManager)
        );
        console.log("OracleMaster deployed at:", address(oracleMaster));

        // 5. Deploy Profile (needs permission manager)
        console.log("Deploying Profile...");
        profile = new Profile(address(permissionManager));
        console.log("Profile deployed at:", address(profile));

        // 6. Deploy State Manager
        console.log("Deploying StateManager...");
        stateManager = new StateManager(address(profile));
        console.log("StateManager deployed at:", address(stateManager));

        // 8. Deploy Merkle Verifier
        console.log("Deploying MerkleVerifier...");
        merkleVerifier = new MerkleVerifier();
        console.log("MerkleVerifier deployed at:", address(merkleVerifier));

        // 9. Deploy Proof Sync
        console.log("Deploying ProofSync...");
        proofSync = new ProofSync(address(merkleVerifier), payable(ccip)); // Messenger will be set later
        console.log("ProofSync deployed at:", address(proofSync));
        // 0. messenger
        console.log("Deploying Messenger...");
        //   using ccip as router address
        messenger = new Messenger(
            BASE_ROUTER,
            BASE_LINK_TOKEN,
            address(merkleVerifier)
        );
        console.log("PermissionManager deployed at:", address(messenger));

        // 10. Deploy CCIP
        console.log("Deploying CrossToken (CCIP)...");
        ccip = new CrossToken(BASE_ROUTER, BASE_LINK_TOKEN);
        console.log("CrossToken deployed at:", address(ccip));

        // 11. Deploy Sync Function
        console.log("Deploying SyncFunction...");
        syncFunction = new Sync(address(stateManager));
        console.log("SyncFunction deployed at:", address(syncFunction));

        // 12. Deploy Fee
        console.log("Deploying Fee...");
        fee = new Fee(
            address(0), // protocol fee receiver - will be set later
            address(0), // auction contract - will be set after auction deployment
            address(permissionManager), // global permission manager
            30 // stake amount required
        );
        console.log("Fee deployed at:", address(fee));

        // 13. Deploy Reputation
        console.log("Deploying Reputation...");
        reputation = new Reputation(
            30, // required stake
            BASE_USDC_TOKEN, // stake token
            address(0), // car registry - will be set after
            address(permissionManager)
        );
        console.log("Reputation deployed at:", address(reputation));

        // 14. Deploy Car Registry
        console.log("Deploying CarRegistry...");
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
        console.log("CarRegistry deployed at:", address(carRegistry));

        // deploying state check automation function
        console.log("Deploying statecheckfunction....");
        stateCheckFunction = new StateCheckFunction(
            address(stateManager),
            address(carRegistry)
        );
        console.log("", address(stateCheckFunction));

        // 7. Deploy Init Function
        console.log("Deploying InitFunction...");
        initFunction = new InitFunction(
            address(stateManager),
            address(carRegistry)
        ); // Will be set after registry
        console.log("InitFunction deployed at:", address(initFunction));

        // 15. Deploy Zero NFT
        console.log("Deploying ZeroNFT...");
        zeroNFT = new ZeroNFT(
            address(oracleMaster),
            address(reputation),
            address(carRegistry),
            address(0) // auction contract - will be set after
        );
        console.log("ZeroNFT deployed at:", address(zeroNFT));

        // 16. Deploy Auction
        console.log("Deploying Auction...");
        auction = new Auction(
            address(carRegistry),
            address(zeroNFT),
            address(oracleMaster),
            BASE_ETH_USD_FEED,
            BASE_USDC_USD_FEED
        );
        console.log("Auction deployed at:", address(auction));

        IERC20(BASE_LINK_TOKEN).transferFrom(deployer, address(ccip), AMOUNT);
        IERC20(BASE_LINK_TOKEN).transferFrom(
            deployer,
            address(messenger),
            AMOUNT
        );

        vm.stopBroadcast();

        // Post-deployment setup
        console.log("Setting up post-deployment configurations...");

        vm.startBroadcast(deployerPrivateKey);

        // Set InitFunction in registry
        carRegistry.setInitFunction(address(initFunction));
        console.log("InitFunction set in CarRegistry");

        // Set registry in profile
        profile.setRegistry(address(carRegistry));
        console.log("Registry set in Profile");

        // Set auction in ZeroNFT
        zeroNFT.setAuctionContract(address(auction));
        console.log("Auction set in ZeroNFT");

        // Transfer ownership of InitFunction to registry
        initFunction.transferOwnership(address(carRegistry));
        console.log("InitFunction ownership transferred to CarRegistry");

        // set Messenger in proofSync
        proofSync.setMessenger(payable(messenger));

        //allow des chains
        //uint64[]  destinationChains = new uint64[](4);
        uint64 destinationChains1 = 3676871237479449268; // sonic
        uint64 destinationChains2 = 222782988166878823; // hedera
        uint64 destinationChains3 = 16015286601757825753; // eth
        uint64 destinationChains4 = 14767482510784806043; // avalanche

        ccip.allowlistDestinationChain(destinationChains1, true);
        ccip.allowlistDestinationChain(destinationChains2, true);
        ccip.allowlistDestinationChain(destinationChains3, true);
        ccip.allowlistDestinationChain(destinationChains4, true);
        // Grant permissions to the specified address
        address permissionAddress = 0xf0830060f836B8d54bF02049E5905F619487989e; //@intergrator address
        console.log("Granting permissions to:", permissionAddress);

        // Grant all permissions from PermissionManager
        bytes4[] memory permissions = new bytes4[](20);

        // Oracle permissions
        permissions[0] = oracleMaster.REGISTER_CAR_BRAND_SELECTOR();
        permissions[1] = oracleMaster.UPDATE_ORACLE_SELECTOR();
        permissions[2] = oracleMaster.DEACTIVATE_ORACLE_SELECTOR();
        permissions[3] = oracleMaster.REACTIVATE_ORACLE_SELECTOR();
        permissions[4] = oracleMaster.BATCH_UPDATE_PRICES_SELECTOR();
        permissions[5] = oracleMaster.INCREMENT_PRODUCT_COUNT_SELECTOR();
        permissions[6] = oracleMaster.DECREMENT_PRODUCT_COUNT_SELECTOR();

        // Reputation permissions
        permissions[7] = reputation.SLASH();
        permissions[8] = reputation.WITHDRAW_SLASHED_ETH();
        permissions[9] = reputation.WITHDRAW_SLASHED_USDC();
        permissions[10] = reputation.SET_STAKE_AMOUNT();

        // Fee permissions
        permissions[11] = fee.SET_FEE();
        permissions[12] = fee.SET_FEE_RECEIVER();
        permissions[13] = fee.WITHDRAW_FEE();

        // Profile permissions
        permissions[14] = profile.UPDATESTATE();
        permissions[15] = profile.LOCKBRAND();
        permissions[16] = profile.UNLOCKBRAND();

        // State permissions
        permissions[17] = stateManager.SET_STATE();
        permissions[18] = stateManager.LOCK_CONTRACT();
        permissions[19] = stateManager.UNLOCK_CONTRACT();

        // Grant all permissions with 1 year expiration
        uint256 expirationTime = block.timestamp + 365 days;
        permissionManager.grantBatchPermissions(
            permissionAddress,
            permissions,
            expirationTime
        );
        console.log("All permissions granted to:", permissionAddress);

        // set donId
        initFunction.setDon(BASE_FUNCTION_DON_ID);

        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Base");
        console.log("Deployer:", deployer);
        console.log("PermissionManager:", address(permissionManager));
        console.log("BrandPermissionManager:", address(brandPermissionManager));
        console.log("CarOracle:", address(carOracle));
        console.log("OracleMaster:", address(oracleMaster));
        console.log("Profile:", address(profile));
        console.log("StateManager:", address(stateManager));
        console.log("InitFunction:", address(initFunction));
        console.log("MerkleVerifier:", address(merkleVerifier));
        console.log("ProofSync:", address(proofSync));
        console.log("CrossToken (CCIP):", address(ccip));
        console.log("SyncFunction:", address(syncFunction));
        console.log("Fee:", address(fee));
        console.log("Reputation:", address(reputation));
        console.log("CarRegistry:", address(carRegistry));
        console.log("ZeroNFT:", address(zeroNFT));
        console.log("Auction:", address(auction));
        console.log("StateCheckFunction", address(stateCheckFunction));
        console.log("=== DEPLOYMENT COMPLETE ===");
    }
}
