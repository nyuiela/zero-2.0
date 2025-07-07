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

    // =========================
    // Token Addresses (Base)
    // =========================
    address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    // =========================
    // Arbitrage Engine Config
    // =========================
    uint256 public constant MAX_CYCLES = 10;
    uint256 public constant MAX_BORROW_AMOUNT = 1_000_000e6; // 1M USDC
    uint256 public constant MIN_PROFIT_THRESHOLD = 100e6; // 100 USDC
    uint256 public constant MAX_SLIPPAGE_BPS = 50; // 0.5%
    uint256 public constant GAS_PRICE_LIMIT = 50 gwei;
    uint256 public constant MAX_GAS_PER_CYCLE = 500_000;

    function run() external returns (address flashArbitrageEngineAddr) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address zeroNFT = vm.envAddress("NEXT_PUBLIC_ZERO_NFT_ADDRESS");

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);

        console2.log("=== Deploying FlashArbitrageEngine on Base ===");
        console2.log("Deployer:", deployer);

        // =========================
        // Step 1: Deploy Oracle Router
        // =========================
        console2.log("\nDeploying Oracle Router...");
        vm.makePersistent(ORACLE_ROUTER_FACTORY);
        IEulerRouterFactory routerFactory = IEulerRouterFactory(
            ORACLE_ROUTER_FACTORY
        );
        vm.makePersistent(address(routerFactory));

        address oracleRouter = routerFactory.deploy(deployer); // Governor set as deployer
        console2.log("Oracle Router deployed at:", oracleRouter);

        // =========================
        // Step 2: Locate WETH-USDC Pool or Default to Periphery
        // =========================
        console2.log("\nLocating WETH-USDC Pool...");
        IEulerSwapFactory swapFactory = IEulerSwapFactory(
            EULER_SWAP_V1_FACTORY
        );
        address[] memory wethUsdcPools = swapFactory.poolsByPair(WETH, USDC);

        address swapPool;
        if (wethUsdcPools.length > 0) {
            swapPool = wethUsdcPools[0];
            console2.log("Found existing WETH-USDC pool:", swapPool);
        } else {
            console2.log(
                "No WETH-USDC pool found. Using Periphery:",
                EULER_SWAP_V1_PERIPHERY
            );
            swapPool = EULER_SWAP_V1_PERIPHERY;
        }

        // =========================
        // Step 3: Discover Multiple eVaults for Better Options
        // =========================
        console2.log(
            "\nDiscovering multiple eVaults for better user options..."
        );

        // Discover WETH vaults
        address[] memory wethVaults = _discoverVaults(WETH, 5, deployer); // Find up to 5 WETH vaults
        console2.log("Discovered", wethVaults.length, "WETH vaults");

        // Discover USDC vaults
        address[] memory usdcVaults = _discoverVaults(USDC, 5, deployer); // Find up to 5 USDC vaults
        console2.log("Discovered", usdcVaults.length, "USDC vaults");

        if (wethVaults.length == 0 && usdcVaults.length == 0) {
            console2.log("WARNING: No vaults discovered automatically.");
            console2.log("You may need to manually add vault addresses.");
        }

        // =========================
        // Step 4: Deploy Arbitrage Engine
        // =========================
        console2.log("\nDeploying FlashArbitrageEngine...");
        FlashArbitrageEngine flashArbitrageEngine = new FlashArbitrageEngine(
            payable(EVC),
            swapPool,
            oracleRouter,
            zeroNFT
        );
        flashArbitrageEngineAddr = address(flashArbitrageEngine);

        console2.log(
            "FlashArbitrageEngine deployed at:",
            address(flashArbitrageEngine)
        );

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

        // =========================
        // Step 6: Add Multiple Vaults for Better Options
        // =========================
        console2.log("\nAdding multiple vaults for better user options...");

        // Add WETH vaults
        for (uint i = 0; i < wethVaults.length; i++) {
            if (wethVaults[i] != address(0)) {
                flashArbitrageEngine.addTokenVault(WETH, wethVaults[i]);
                console2.log("WETH Vault", i + 1, "added:", wethVaults[i]);

                // Set initial vault info (these should be fetched from actual vaults)
                flashArbitrageEngine.updateVaultInfo(
                    wethVaults[i],
                    1000000e18, // 1M WETH liquidity
                    500, // 5% borrow rate (in basis points)
                    75 // 75% utilization
                );

                // Authorize for EVC operations
                flashArbitrageEngine.authorizeVault(wethVaults[i], true);
            }
        }

        // Add USDC vaults
        for (uint i = 0; i < usdcVaults.length; i++) {
            if (usdcVaults[i] != address(0)) {
                flashArbitrageEngine.addTokenVault(USDC, usdcVaults[i]);
                console2.log("USDC Vault", i + 1, "added:", usdcVaults[i]);

                // Set initial vault info (these should be fetched from actual vaults)
                flashArbitrageEngine.updateVaultInfo(
                    usdcVaults[i],
                    5000000e6, // 5M USDC liquidity
                    300, // 3% borrow rate (in basis points)
                    60 // 60% utilization
                );

                // Authorize for EVC operations
                flashArbitrageEngine.authorizeVault(usdcVaults[i], true);
            }
        }

        // Log best vaults
        address bestWethVault = flashArbitrageEngine.getBestVault(WETH);
        address bestUsdcVault = flashArbitrageEngine.getBestVault(USDC);
        console2.log("Best WETH vault:", bestWethVault);
        console2.log("Best USDC vault:", bestUsdcVault);

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
        console2.log(
            "FlashArbitrageEngine Address:",
            address(flashArbitrageEngine)
        );
        console2.log("\nNext Steps:");
        console2.log("1. Verify vault discovery worked correctly");
        console2.log("2. Monitor vault performance and update info regularly");
        console2.log("3. Add more vaults as they become available");
    }

    /**
     * @dev Discover vaults for a given token by checking the eVault factory
     * @param token The token to find vaults for
     * @param maxVaults Maximum number of vaults to discover
     * @param deployer The deployer address
     * @return discoveredVaults Array of discovered vault addresses
     */
    function _discoverVaults(
        address token,
        uint256 maxVaults,
        address deployer
    ) internal view returns (address[] memory discoveredVaults) {
        // For now, return empty array - manual vault addition will be needed
        // In production, you'd implement proper vault discovery logic here
        // This could involve:
        // 1. Querying the eVault factory for deployed vaults
        // 2. Checking vault registries
        // 3. Scanning recent events for vault deployments

        address[] memory result = new address[](0);
        return result;
    }
}
