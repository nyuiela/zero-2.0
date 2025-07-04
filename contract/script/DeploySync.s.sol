// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "forge-std/Script.sol";
// import {PermissionManager} from "../src/Permission/PermissionManager.sol";
// import {Sync} from "../src/chainlink/sync_function.sol";
// import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";

// contract DeployScript is Script {
//     // Base Network Addresses
//     address constant _BASE_ETH_USD_FEED =
//         0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
//     address constant _BASE_USDC_USD_FEED =
//         0x7e860098F58bBFC8648a4311b374B1D669a2bc6B;
//     address constant _BASE_USDC_TOKEN =
//         0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
//     address constant _BASE_ROUTER = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
//     address constant _BASE_LINK_TOKEN =
//         0xE4aB69C077896252FAFBD49EFD26B5D171A32410;

//     address constant _BASE_FUNCTION_ROUTER =
//         0xf9B8fc078197181C841c296C876945aaa425B278;
//     bytes32 constant _BASE_FUNCTION_DON_ID =
//         0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000; // fun-base-sepolia-1
//     //uint64 const ant BASE_CHAIN_SELECTOR_ID = 10344971235874465080; // Base Sepolia Chain ID
//     uint256 constant _AMOUNT = 1000000000000000000; // 1 LINK in wei

//     // steps for deployment
//     // 1. Deploy PermissionManager
//     // 2. Deploy BrandPermissionManager
//     // 3. Deploy Init_Function
//     // 4. setDonId in Init_Function || router is hardcoded but we can set that.

//     // Deployment addresses
//     Sync public sync;

//     function run() external {
//         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
//         address deployer = vm.addr(deployerPrivateKey);
//         //   uint256 deployerPrivateKey = vm.envUint("DEFAULT_ANVIL_KEY");
//         //   address deployer = vm.addr(deployerPrivateKey);
//         //   vm.makePersistent(deployer);
//         console.log("Deploying contracts to Base network...");
//         console.log("Deployer address:", deployer);

//         vm.createSelectFork(vm.rpcUrl("basechain"));

//         vm.startBroadcast(deployerPrivateKey);

//         console.log("Deploying SyncFunction...");
//         sync = new Sync();
//         vm.makePersistent(address(sync));
//         console.log("Sync deployed at:", address(sync));

//         vm.stopBroadcast();

//         // Transfer LINK tokens to CCIP and Messenger
//         console.log("Transferring LINK tokens to CCIP and Messenger...");
//         // Log deployment summary
//         console.log("\n=== DEPLOYMENT SUMMARY ===");
//         console.log("Network: Base");
//         console.log("Deployer:", deployer);
//         console.log("SyncContract=", address(sync));
//     }
// }

// contract DeployNFT is Script {
//     ZeroNFT public zeroNft;

//     function run() external {
//         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
//         address deployer = vm.addr(deployerPrivateKey);
//         address auction = vm.envAddress("AUCTION_ADDRESS");
//         address _oraclemaster = vm.envAddress("ORACLE_MASTER_ADDRESS");
//         address reputationContract = vm.envAddress("REPUTATION_ADDRESS");
//         address carRegistry = vm.envAddress("CAR_REGISTRY_ADDRESS");

//         vm.createSelectFork(vm.rpcUrl("basechain"));
//         vm.startBroadcast(deployerPrivateKey);

//         console.log("Deploying contracts to Base network...");
//         console.log("Deployer address:", deployer);
//         deployZeroNft(_oraclemaster, carRegistry, reputationContract, auction);
//         vm.stopBroadcast();
//     }

//     function deployZeroNft(
//         address oracleMaster,
//         address carRegistry,
//         address reputation,
//         address _auction
//     ) internal {
//         zeroNft = new ZeroNFT(
//             address(oracleMaster),
//             address(reputation),
//             address(carRegistry),
//             address(_auction)
//         );
//     }
// }
