// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
import {IEulerRouterFactory} from "../src/Interface/Eular/IRouterFactory.sol";
import {IEulerSwapFactory} from "../src/Interface/Eular/IEulerSwapFactory.sol";

contract DeployFlashArbitrageEngine is Script {
    // =========================
    // Base Network Euler Addresses
    // =========================
    address public constant EVC = 0x5301c7dD20bD945D2013b48ed0DEE3A284ca8989;
    address public constant EVAULT_FACTORY = 0x7F321498A801A191a93C840750ed637149dDf8D0;
    address public constant EVAULT_IMPLEMENTATION = 0x30a9A9654804F1e5b3291a86E83EdeD7cF281618;
    address public constant EULER_SWAP_V1_FACTORY = 0xf0CFe22d23699ff1B2CFe6B8f706A6DB63911262;
    address public constant EULER_SWAP_V1_PERIPHERY = 0x18e5F5C1ff5e905b32CE860576031AE90E1d1336;
    address public constant ORACLE_ROUTER_FACTORY = 0xA9287853987B107969f181Cce5e25e0D09c1c116;

    // =========================
    // Token Addresses (Base)
    // =========================
    address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    // =========================
    // Arbitrage Engine Config
    // =========================
    uint256 public constant MAX_CYCLES = 10;
    uint256 public constant MAX_BORROW_AMOUNT = 1_000_000e6;  // 1M USDC
    uint256 public constant MIN_PROFIT_THRESHOLD = 100e6;     // 100 USDC
    uint256 public constant MAX_SLIPPAGE_BPS = 50;            // 0.5%
    uint256 public constant GAS_PRICE_LIMIT = 50 gwei;
    uint256 public constant MAX_GAS_PER_CYCLE = 500_000;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);

        console2.log("=== Deploying FlashArbitrageEngine on Base ===");
        console2.log("Deployer:", deployer);

        // =========================
        // Step 1: Deploy Oracle Router
        // =========================
        console2.log("\nDeploying Oracle Router...");
        IEulerRouterFactory routerFactory = IEulerRouterFactory(ORACLE_ROUTER_FACTORY);
        address oracleRouter = routerFactory.deploy(deployer);  // Governor set as deployer
        console2.log("Oracle Router deployed at:", oracleRouter);

        // =========================
        // Step 2: Locate WETH-USDC Pool or Default to Periphery
        // =========================
        console2.log("\nLocating WETH-USDC Pool...");
        IEulerSwapFactory swapFactory = IEulerSwapFactory(EULER_SWAP_V1_FACTORY);
        address[] memory wethUsdcPools = swapFactory.poolsByPair(WETH, USDC);

        address swapPool;
        if (wethUsdcPools.length > 0) {
            swapPool = wethUsdcPools[0];
            console2.log("Found existing WETH-USDC pool:", swapPool);
        } else {
            console2.log("No WETH-USDC pool found. Using Periphery:", EULER_SWAP_V1_PERIPHERY);
            swapPool = EULER_SWAP_V1_PERIPHERY;
        }

        // =========================
        // Step 3: Locate WETH eVault (Manual Lookup Needed)
        // =========================
        console2.log("\nSearching for WETH eVault (manual step required)...");
        address wethVault = address(0);  // Placeholder - requires manual lookup

        if (wethVault == address(0)) {
            console2.log("WARNING: No WETH vault found.");
            console2.log("You MUST locate the correct WETH eVault address before authorizing.");
        }

        // =========================
        // Step 4: Deploy Arbitrage Engine
        // =========================
        console2.log("\nDeploying FlashArbitrageEngine...");
        FlashArbitrageEngine flashArbitrageEngine = new FlashArbitrageEngine(
            payable(EVC),
            swapPool,
            oracleRouter
        );

        console2.log("FlashArbitrageEngine deployed at:", address(flashArbitrageEngine));

        // =========================
        // Step 5: Configure Engine
        // =========================
        flashArbitrageEngine.updateConfig(
            MAX_CYCLES,
            MAX_BORROW_AMOUNT,
            MIN_PROFIT_THRESHOLD,
            MAX_SLIPPAGE_BPS
        );

        flashArbitrageEngine.updateGasConfig(
            GAS_PRICE_LIMIT,
            MAX_GAS_PER_CYCLE
        );

        if (wethVault != address(0)) {
            flashArbitrageEngine.authorizeVault(wethVault, true);
            console2.log("WETH Vault authorized:", wethVault);
        }

        // =========================
        // Step 6: Verify Deployment
        // =========================
        console2.log("\n=== Deployment Verification ===");
        // console2.log("EVC:", flashArbitrageEngine.evc());
        // console2.log("EulerSwap:", flashArbitrageEngine.eulerSwap());
        // console2.log("EulerRouter:", flashArbitrageEngine.eulerRouter());
        // console2.log("Owner:", flashArbitrageEngine.owner());
        // console2.log("Max Cycles:", flashArbitrageEngine.maxCycles());
        // console2.log("Max Borrow Amount:", flashArbitrageEngine.maxBorrowAmount());
        // console2.log("Min Profit Threshold:", flashArbitrageEngine.minProfitThreshold());
        // console2.log("Max Slippage BPS:", flashArbitrageEngine.maxSlippageBps());
        // console2.log("Use EVC:", flashArbitrageEngine.useEVC());

        vm.stopBroadcast();

        // =========================
        // Deployment Summary
        // =========================
        console2.log("\n=== Deployment Complete ===");
        console2.log("FlashArbitrageEngine Address:", address(flashArbitrageEngine));
        console2.log("\nNext Steps:");
   
    }
}
