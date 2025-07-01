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

    address constant AVALANCHE_ROUTER =
        0xF694E193200268f9a4868e4Aa017A0118C9a8177;
    address constant AVALANCHE_LINK_TOKEN =
        0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    address constant AVALANCHE_ETH_USD_FEED =
        0x86d67c3D38D2bCeE722E601025C25a575021c6EA;
    address constant AVALANCHE_USDC_USD_FEED =
        0x97FE42a7E96640D932bbc0e1580c73E705A8EB73;
    uint256 constant AVALANCHE_CHAIN_SELECTOR_ID = 14767482510784806043;
    uint64 constant BASE_CHAIN_SELECTOR = 10344971235874465080;
    uint256 constant AMOUNT = 1000000000000000000;

    function run() public {
        /// min chain deployed address
        address oraclemaster = vm.envAddress("ORACLE_MASTER_ADDRESS");
        address reputationContract = vm.envAddress("REPUTATION_ADDRESS");
        //address permissionManager = vm.envAddress("PERMISSION_MANAGER_ADDRESS");
        address brandPermissionManager = vm.envAddress(
            "BRAND_PERMISSION_MANAGER_ADDRESS"
        );
        address carRegistry = vm.envAddress("CAR_REGISTRY_ADDRESS");
        address profile = vm.envAddress("PROFILE_ADDRESS");
        //uint64 baseSelectorId = vm.envAddress("BASE_SELECTOR_ID ");

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts to hedera network...");
        console.log("Deployer address:", deployer);

        vm.createSelectFork(vm.rpcUrl("avalanche"));
        vm.startBroadcast(deployerPrivateKey);

        // deploy cross chain
        deployCrossChain(
            carRegistry,
            oraclemaster,
            profile,
            reputationContract,
            deployer
        );
        setConfigs(deployer, BASE_CHAIN_SELECTOR);
        IERC20(AVALANCHE_LINK_TOKEN).transferFrom(
            deployer,
            address(ccip),
            AMOUNT
        );
        IERC20(AVALANCHE_LINK_TOKEN).transferFrom(
            deployer,
            address(messenger),
            AMOUNT
        );
        vm.stopBroadcast();

        // logs
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
        console.log("Deploying permission manager.....");
        permission = new PermissionManager();
        console.log("Permission Manager deployed at:", address(permission));

        //ccip
        console.log("Deploying CrossToken (CCIP).....");
        ccip = new CrossToken(AVALANCHE_ROUTER, AVALANCHE_LINK_TOKEN);
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
            AVALANCHE_ETH_USD_FEED,
            AVALANCHE_USDC_USD_FEED,
            _deployer
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
        console.log("\n=== AVALANCHE NETWORK DEPLOYMENT SUMMARY ===");
        console.log("Network: Avalanche (Cross-Chain)");
        console.log("Deployer:", deployer);
        console.log("CrossToken (CCIP):", address(ccip));
        console.log("Messenger:", address(messenger));
        console.log("Auction deployed at:", address(auction));
        console.log("ZeroNFT deployed at:", address(zeroNFT));
        console.log("StateManager deployed at:", address(stateManager));
        console.log("MerkleVerifier deployed at:", address(merkleVerifier));
        console.log("=== AVALANCHE NETWORK DEPLOYMENT COMPLETE ===");
    }
}
