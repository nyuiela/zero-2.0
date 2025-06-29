// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "../lib/foundry-chainlink-toolkit/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "forge-std/Script.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {StateManager} from "../src/core/State.sol";
import {Messenger} from "../src/chainlink/messenging.sol";
import {Auction} from "../src/core/auction.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";

contract DeployCCIP is Script {
    CrossToken public ccip;
    StateManager public stateManager;
    Auction public auction;
    Messenger public messenger;
    MerkleVerifier public merkleVerifier;
    ZeroNFT public zeroNFT;

    address constant ETHERUM_ROUTER = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
    address constant ETHERUM_LINK_TOKEN = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    address constant ETHERUM_ETH_USD_FEED = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
    address constant ETHERUM_USDC_USD_FEED = 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;
    uint64 constant ETHERUM_CHAIN_SELECTOR_ID = 16015286601757825753; // Sepolia Testnet Chain ID
    uint64 constant BASE_CHAIN_SELECTOR = 10344971235874465080;
    uint256 constant AMOUNT = 1000000000000000000;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts to eth sepolia network...");
        console.log("Deployer address:", deployer);

        /// min chain deployed address
        address oraclemaster = vm.envAddress("ORACLE_MASTER_ADDRESS");
        address reputationContract = vm.envAddress("REPUTATION_ADDRESS");
        address permissionManager = vm.envAddress("PERMISSION_MANAGER_ADDRESS");
        address brandPermissionManager = vm.envAddress("BRAND_PERMISSION_MANAGER_ADDRESS");
        address carRegistry = vm.envAddress("CAR_REGISTRY_ADDRESS");
        address profile = vm.envAddress("PROFILE_ADDRESS");
        // uint64 baseSelectorId = vm.envAddress("BASE_SELECTOR_ID ");

        vm.createSelectFork(vm.rpcUrl("etherum "));
        vm.startBroadcast(deployerPrivateKey);

        // deploy cross chain
        deployCrossChain(carRegistry, oraclemaster, profile, reputationContract);
        setConfigs(deployer, BASE_CHAIN_SELECTOR);
        IERC20(ETHERUM_LINK_TOKEN).transferFrom(deployer, address(ccip), AMOUNT);
        IERC20(ETHERUM_LINK_TOKEN).transferFrom(deployer, address(messenger), AMOUNT);
        vm.stopBroadcast();

        //logs
        logDeploymentSummary(deployer);
    }

    function deployCrossChain(address _carRegistry, address _oraclemaster, address _profile, address _reputation)
        internal
    {
        //ccip
        console.log("Deploying CrossToken (CCIP).....");
        ccip = new CrossToken(ETHERUM_ROUTER, ETHERUM_LINK_TOKEN);
        console.log("CrossToken deployed at:", address(ccip));

        //  Deploy Merkle Verifier
        console.log("Deploying MerkleVerifier...");
        merkleVerifier = new MerkleVerifier();
        console.log("MerkleVerifier deployed at:", address(merkleVerifier));

        //messanger
        console.log("Deploying Messenger ....");
        messenger = new Messenger(address(_carRegistry), address(_oraclemaster), address(merkleVerifier));
        console.log("Messenger deployed at", address(messenger));

        //  Deploy State Manager
        console.log("Deploying StateManager...");
        stateManager = new StateManager(address(_profile));
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
            address(_carRegistry), address(zeroNFT), address(_oraclemaster), ETHERUM_ETH_USD_FEED, ETHERUM_USDC_USD_FEED
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
        console.log("\n=== ETHEREUM NETWORK DEPLOYMENT SUMMARY ===");
        console.log("Network: ETHEREUM  (Cross-Chain)");
        console.log("Deployer:", deployer);
        console.log("CrossToken (CCIP):", address(ccip));
        console.log("Messenger:", address(messenger));
        console.log("Auction deployed at:", address(auction));
        console.log("ZeroNFT deployed at:", address(zeroNFT));
        console.log("StateManager deployed at:", address(stateManager));
        console.log("MerkleVerifier deployed at:", address(merkleVerifier));
        console.log("=== ETHEREUM  NETWORK DEPLOYMENT COMPLETE ===");
    }
}
