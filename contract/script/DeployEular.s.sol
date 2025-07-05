// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
import {console} from "forge-std/console.sol";

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
    uint256 public constant MAX_SLIPPAGE_BPS = 0; // 0.5%

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);

        console.log("=== Deploying FlashArbitrageManager on Base ===");
        console.log("Deployer:", deployer);
        console.log("EVC:", EVC);
        console.log("EulerSwap Factory:", EULER_SWAP_V1_FACTORY);
        console.log("EulerSwap Periphery:", EULER_SWAP_V1_PERIPHERY);
        console.log("Oracle Router Factory:", ORACLE_ROUTER_FACTORY);
        console.log("WETH:", WETH);
        console.log("USDC:", USDC);

        // Deploy FlashArbitrageManager
        FlashArbitrageEngine flashArbitrageEngine = new FlashArbitrageEngine(
            EVAULT_FACTORY, // vault - using eVault factory as the vault
            EULER_SWAP_V1_PERIPHERY, // eulerSwap - using periphery for swaps
            ORACLE_ROUTER_FACTORY // eulerRouter - using oracle router factory
        );

        console.log(
            "\nFlashArbitrageManager deployed at:",
            address(flashArbitrageEngine)
        );

        // Update configuration
        flashArbitrageEngine.updateConfig(
            MAX_CYCLES,
            MAX_BORROW_AMOUNT,
            MIN_PROFIT_THRESHOLD,
            MAX_SLIPPAGE_BPS
        );

        vm.stopBroadcast();

        console.log("\nDeployment completed successfully!");
        console.log("Contract address:", address(flashArbitrageEngine));
        console.log("\nNext steps:");
        console.log("1. Verify contract on BaseScan");
        console.log("2. Test with small amounts first");
        console.log("3. Monitor for any issues");
        console.log("4. Consider setting up monitoring/alerting");
    }
}
