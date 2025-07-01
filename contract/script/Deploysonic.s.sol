// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "../lib/foundry-chainlink-toolkit/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "forge-std/Script.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {StateManager} from "../src/core/State.sol";
import {Auction} from "../src/core/auction.sol";
import {Messenger} from "../src/chainlink/messenging.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";
import {PermissionManager} from "../src/permission/PermissionManager.sol";

contract DeployCCIP is Script {
    CrossToken public ccip;
    StateManager public stateManager;
    Auction public auction;
    Messenger public messenger;
    MerkleVerifier public merkleVerifier;
    ZeroNFT public zeroNFT;
    PermissionManager public permission;

    address constant SONIC_ROUTER = 0x2fBd4659774D468Db5ca5bacE37869905d8EfA34;
    address constant SONIC_LINK_TOKEN =
        0xd8C1eEE32341240A62eC8BC9988320bcC13c8580;
    address constant SONIC_ETH_USD_FEED =
        0x5cfF644dDcd40C2165e2C58d146F852f23fe1b0C;
    address constant SONIC_USDC_USD_FEED =
        0x0Cb75Ba04aAfEd69449920759055482F9BaDcdeD;
    uint64 constant SONIC_CHAIN_SELECTOR_ID = 3676871237479449268; // Sonic Chain ID
    uint64 constant BASE_CHAIN_SELECTOR = 10344971235874465080;
    uint256 constant AMOUNT = 1000000000000000000;

    // STATE MANAGER,
    // AUCTION
    // MESSENGER
    // MERKLE VERIFIER
    // CCIP
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts to sonic network...");
        console.log("Deployer address:", deployer);

        /// min chain deployed address
        address oraclemaster = vm.envAddress("ORACLE_MASTER_ADDRESS");
        address reputationContract = vm.envAddress("REPUTATION_ADDRESS");
        //   address permissionManager = vm.envAddress("PERMISSION_MANAGER_ADDRESS");
        address brandPermissionManager = vm.envAddress(
            "BRAND_PERMISSION_MANAGER_ADDRESS"
        );
        address carRegistry = vm.envAddress("CAR_REGISTRY_ADDRESS");
        address profile = vm.envAddress("PROFILE_ADDRESS");
        // uint64 baseSelectorId = vm.env("BASE_SELECTOR_ID");

        vm.createSelectFork(vm.rpcUrl("sonicchain"));
        vm.startBroadcast(deployerPrivateKey);

        // deploy cross chain
        deployCrossChain(
            carRegistry,
            oraclemaster,
            profile,
            reputationContract
        );
        setConfigs(deployer, BASE_CHAIN_SELECTOR);
        IERC20(SONIC_LINK_TOKEN).approve(address(this), type(uint256).max);
        IERC20(SONIC_LINK_TOKEN).transferFrom(
            deployer,
            address(messenger),
            AMOUNT
        );
        vm.stopBroadcast();

        //log
        logDeploymentSummary(deployer);
    }

    function deployCrossChain(
        address _carRegistry,
        address _oraclemaster,
        address _profile,
        address _reputation
    ) internal {
        //permission
        console.log("Deploying PermissionManager...");
        permission = new PermissionManager();
        console.log("PermissionManager deployed at:", address(permission));
        //ccip
        console.log("Deploying CrossToken (CCIP).....");
        ccip = new CrossToken(SONIC_ROUTER, SONIC_LINK_TOKEN);
        console.log("CrossToken deployed at:", address(ccip));

        //  Deploy Merkle Verifier
        console.log("Deploying MerkleVerifier...");
        merkleVerifier = new MerkleVerifier();
        console.log("MerkleVerifier deployed at:", address(merkleVerifier));

        //messanger
        console.log("Deploying Messenger ....");
        messenger = new Messenger(
            address(_carRegistry),
            address(_oraclemaster),
            address(merkleVerifier)
        );
        console.log("Messenger deployed at", address(messenger));

        //  Deploy State Manager
        console.log("Deploying StateManager...");
        stateManager = new StateManager(address(_profile), address(permission));
        console.log("StateManager deployed at:", address(stateManager));

        // 15. Deploy Zero NFT
        console.log("Deploying ZeroNFT...");
        zeroNFT = new ZeroNFT(
            address(_oraclemaster),
            address(_reputation),
            address(_carRegistry),
            address(0) // auction contract - will be set after
        );
        console.log("ZeroNFT deployed at:", address(zeroNFT));

        // 16. Deploy Auction
        console.log("Deploying Auction...");
        auction = new Auction(
            payable(_carRegistry),
            address(zeroNFT),
            address(_oraclemaster),
            SONIC_ETH_USD_FEED,
            SONIC_USDC_USD_FEED
        );
        console.log("Auction deployed at:", address(auction));
    }

    function setConfigs(address deployer, uint64 _baseSelectorId) internal {
        // Set auction in ZeroNFT
        zeroNFT.setAuctionContract(address(auction));
        console.log("Auction set in ZeroNFT");

        // dest chain
        ccip.allowlistDestinationChain(_baseSelectorId, true);
    }

    function logDeploymentSummary(address deployer) internal view {
        console.log("\n=== SONIC NETWORK DEPLOYMENT SUMMARY ===");
        console.log("Network: SONIC (Cross-Chain)");
        console.log("Deployer:", deployer);
        console.log("CrossToken (CCIP):", address(ccip));
        console.log("Messenger:", address(messenger));
        console.log("Auction deployed at:", address(auction));
        console.log("ZeroNFT deployed at:", address(zeroNFT));
        console.log("StateManager deployed at:", address(stateManager));
        console.log("MerkleVerifier deployed at:", address(merkleVerifier));
        console.log("=== SONIC  NETWORK DEPLOYMENT COMPLETE ===");
    }
}
