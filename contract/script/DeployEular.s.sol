// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
import {IEulerRouter} from "../src/interface/Eular/IEulerRouter.sol";
import {IEulerSwap} from "../src/interface/Eular/IEulerSwapFactory.sol";

contract DeployFlashArbitrageEngine is Script {
    // Base Network Euler Protocol Addresses
    address public constant EVC = 0x5301c7dD20bD945D2013b48ed0DEE3A284ca8989;
    address public constant EVAULT_FACTORY =
        0x7F321498A801A191a93C840750ed637149dDf8D0;
    address public constant EVAULT_IMPLEMENTATION =
        0x30a9A9654804F1e5b3291a86E83EdeD7cF281618;
    address public constant EULER_SWAP_V1_FACTORY =
        0xf0CFe22d23699ff1B2CFe6B8f706A6DB63911262;
    address public constant EULER_SWAP_V1_PERIPHERY =
        0x18e5F5C1ff5e905b32CE860576031AE90E1d1336;
    address public constant ORACLE_ROUTER_FACTORY =
        0xA9287853987B107969f181Cce5e25e0D09c1c116;
    // Token Addresses on Base
    address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70; // Base WETH
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Base USDC
    // Configuration
    uint256 public constant MAX_CYCLES = 10;
    uint256 public constant MAX_BORROW_AMOUNT = 1000000e6; // 1M USDC
    uint256 public constant MIN_PROFIT_THRESHOLD = 100e6; // 100 USDC
    uint256 public constant MAX_SLIPPAGE_BPS = 50; // 0.5%
    uint256 public constant GAS_PRICE_LIMIT = 50 gwei;
    uint256 public constant MAX_GAS_PER_CYCLE = 500000;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);

        console.log("=== Deploying FlashArbitrageEngineEnhanced on Base ===");
        console.log("Deployer:", deployer);
        console.log("EVC:", EVC);
        console.log("EulerSwap Factory:", EULER_SWAP_V1_FACTORY);
        console.log("EulerSwap Periphery:", EULER_SWAP_V1_PERIPHERY);
        console.log("Oracle Router Factory:", ORACLE_ROUTER_FACTORY);
        console.log("WETH:", WETH);
        console.log("USDC:", USDC);
        // Step 1: Deploy Oracle Router
        console.log("\nDeploying Oracle Router...");
        IEulerRouter routerFactory = IEulerRouter(
            ORACLE_ROUTER_FACTORY
        );
        address oracleRouter = routerFactory.deploy(deployer); // Use deployer as governor
        console.log("Oracle Router deployed at:", oracleRouter);
        // Step 2: Check for existing WETH-USDC pools
        console.log("\nChecking for existing WETH-USDC pools...");
        IEulerSwap swapFactory = IEulerSwap(
            EULER_SWAP_V1_FACTORY
        );
        address[] memory wethUsdcPools = swapFactory.poolsByPair(WETH, USDC);
        address swapPool;
        if (wethUsdcPools.length > 0) {
            swapPool = wethUsdcPools[0]; // Use the first available pool
            console.log("Using existing WETH-USDC pool:", swapPool);
        } else {
            console.log("No existing WETH-USDC pools found");
            console.log(
                "You may need to deploy a pool or use a different approach"
            );
            // For now, we'll use the periphery directly
            swapPool = EULER_SWAP_V1_PERIPHERY;
        }
        // Step 3: Find or deploy eVault for WETH
        console.log("\nLooking for WETH eVault...");
        // For now, we'll use a placeholder - you'll need to find the actual vault address
        address wethVault = address(0); // TODO: Find actual WETH vault address
        if (wethVault == address(0)) {
            console.log("WARNING: No WETH vault found!");
            console.log(
                "You need to find the actual WETH vault address on Base"
            );
            console.log(
                "Check Euler's documentation or use their vault finder"
            );
            console.log("For now, we'll deploy without authorizing any vaults");
        }
        console.log("\nDeploying FlashArbitrageEngineEnhanced...");
        console.log("EVC:", EVC);
        console.log("Swap Pool:", swapPool);
        console.log("Oracle Router:", oracleRouter);
        // Deploy FlashArbitrageEngineEnhanced
        FlashArbitrageEngine flashArbitrageEngine = new FlashArbitrageEngine(
            EVC, // evc - Ethereum Vault Connector
            swapPool, // eulerSwap - using pool or periphery
            oracleRouter // eulerRouter - newly deployed router
        );
        console.log(
            "\nFlashArbitrageEngineEnhanced deployed at:",
            address(flashArbitrageEngine)
        );
        // Update configuration
        flashArbitrageEngine.updateConfig(
            MAX_CYCLES,
            MAX_BORROW_AMOUNT,
            MIN_PROFIT_THRESHOLD,
            MAX_SLIPPAGE_BPS
        );
        // Update gas configuration
        flashArbitrageEngine.updateGasConfig(
            GAS_PRICE_LIMIT,
            MAX_GAS_PER_CYCLE
        );
        // Authorize vaults if found
        if (wethVault != address(0)) {
            flashArbitrageEngine.authorizeVault(wethVault, true);
            console.log("WETH vault authorized:", wethVault);
        }
        console.log("\nConfiguration updated:");
        console.log("- Max Cycles:", MAX_CYCLES);
        console.log("- Max Borrow Amount:", MAX_BORROW_AMOUNT / 1e6, "USDC");
        console.log(
            "- Min Profit Threshold:",
            MIN_PROFIT_THRESHOLD / 1e6,
            "USDC"
        );
        console.log("- Max Slippage BPS:", MAX_SLIPPAGE_BPS, "(0.5%)");
        console.log("- Gas Price Limit:", GAS_PRICE_LIMIT / 1e9, "gwei");
        console.log("- Max Gas Per Cycle:", MAX_GAS_PER_CYCLE);
        // Verify deployment
        console.log("\nVerifying deployment...");
        console.log("EVC:", flashArbitrageEngine.evc());
        console.log("EulerSwap:", flashArbitrageEngine.eulerSwap());
        console.log("EulerRouter:", flashArbitrageEngine.eulerRouter());
        console.log("Owner:", flashArbitrageEngine.owner());
        console.log("Max Cycles:", flashArbitrageEngine.maxCycles());
        console.log(
            "Max Borrow Amount:",
            flashArbitrageEngine.maxBorrowAmount()
        );
        console.log(
            "Min Profit Threshold:",
            flashArbitrageEngine.minProfitThreshold()
        );
        console.log("Max Slippage BPS:", flashArbitrageEngine.maxSlippageBps());
        console.log("Use EVC:", flashArbitrageEngine.useEVC());
        vm.stopBroadcast();
        console.log("\nDeployment completed successfully!");
        console.log("Contract address:", address(flashArbitrageEngine));
        console.log("\nIMPORTANT: Enhanced version with EVC integration");
        console.log(
            "1. Supports both EVC batch operations and traditional vault operations"
        );
        console.log("2. Enhanced tracking of arbitrage cycles and gas usage");
        console.log("3. Better error handling and position management");
        console.log("4. Gas price and gas limit controls");
        console.log("5. Vault authorization system for EVC operations");
        console.log("6. Test with small amounts first");
        console.log("7. Monitor for any issues");
        console.log("8. Ensure vault addresses are correct before authorizing");
        console.log("\nNext steps:");
        console.log("1. Find actual WETH and USDC vault addresses on Base");
        console.log("2. Authorize vaults using authorizeVault() function");
        console.log("3. Test EVC operations with small amounts");
        console.log("4. Monitor gas usage and adjust limits if needed");
        console.log("5. Consider implementing additional safety measures");
    }
}
