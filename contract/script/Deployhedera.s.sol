// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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

    address constant HEDERA_ROUTER = 0x802C5F84eAD128Ff36fD6a3f8a418e339f467Ce4;
    address constant HEDERA_LINK_TOKEN =
        0x90a386d59b9A6a4795a011e8f032Fc21ED6FEFb6;
    address constant HEDERA_ETH_USD_FEED =
        0xb9d461e0b962aF219866aDfA7DD19C52bB9871b9;
    address constant HEDERA_USDC_USD_FEED =
        0xb632a7e7e02d76c0Ce99d9C62c7a2d1B5F92B6B5;
    uint256 constant HEDERA_CHAIN_SELECTOR_ID = 222782988166878823; // Hedera Chain ID
    uint64 constant BASE_CHAIN_SELECTOR = 10344971235874465080;
    uint256 constant AMOUNT = 1000000000000000000;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts to hedera network...");
        console.log("Deployer address:", deployer);

        /// min chain deployed address
        address oraclemaster = vm.envAddress(
            "NEXT_PUBLIC_ORACLE_MASTER_ADDRESS"
        );
        address reputationContract = vm.envAddress(
            "NEXT_PUBLIC_REPUTATION_ADDRESS"
        );
        //   address permissionManager = vm.envAddress("PERMISSION_MANAGER_ADDRESS");
        address brandPermissionManager = vm.envAddress(
            "NEXT_PUBLIC_BRAND_PERMISSION_MANAGER_ADDRESS"
        );
        address carRegistry = vm.envAddress("NEXT_PUBLIC_CAR_REGISTRY_ADDRESS");
        address profile = vm.envAddress("NEXT_PUBLIC_PROFILE_ADDRESS");
        // uint64 baseSelectorId = vm.envAddress("BASE_SELECTOR_ID ");

        vm.createSelectFork(vm.rpcUrl("hedera"));
        vm.startBroadcast(deployerPrivateKey);

        // deploy cross chain
        deployCrossChain(
            carRegistry,
            oraclemaster,
            profile,
            reputationContract,
            deployer
        );
        setConfigs(BASE_CHAIN_SELECTOR);
        IERC20(HEDERA_LINK_TOKEN).transferFrom(deployer, address(ccip), AMOUNT);
        IERC20(HEDERA_LINK_TOKEN).transferFrom(
            deployer,
            address(messenger),
            AMOUNT
        );
        vm.stopBroadcast();

        //loggs
        logDeploymentSummary(deployer);
    }

    function deployCrossChain(
        address _carRegistry,
        address _oraclemaster,
        address _profile,
        address _reputation,
        address _deployer
    ) internal {
        //permission
        console.log("Deploying PermissionManager...");
        permission = new PermissionManager();
        console.log("PermissionManager deployed at:", address(permission));

        //ccip
        console.log("Deploying CrossToken (CCIP).....");
        ccip = new CrossToken(HEDERA_ROUTER, HEDERA_LINK_TOKEN);
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
            HEDERA_ETH_USD_FEED,
            HEDERA_USDC_USD_FEED,
            _deployer
        );
        console.log("Auction deployed at:", address(auction));
    }

    function setConfigs(uint64 _baseSelectorId) internal {
        // Set auction in ZeroNFT
        zeroNFT.setAuctionContract(address(auction));
        console.log("Auction set in ZeroNFT");
        // dest chain
        ccip.allowlistDestinationChain(_baseSelectorId, true);
    }

    function logDeploymentSummary(address deployer) internal view {
        console.log("\n===HEDERA NETWORK DEPLOYMENT SUMMARY ===");
        console.log("Network: HEDERA  (Cross-Chain)");
        console.log("Deployer:", deployer);
        console.log("CrossToken (CCIP):", address(ccip));
        console.log("Messenger:", address(messenger));
        console.log("Auction deployed at:", address(auction));
        console.log("ZeroNFT deployed at:", address(zeroNFT));
        console.log("StateManager deployed at:", address(stateManager));
        console.log("MerkleVerifier deployed at:", address(merkleVerifier));
        console.log("=== HEDERA  NETWORK DEPLOYMENT COMPLETE ===");
    }
}
