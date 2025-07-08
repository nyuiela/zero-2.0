// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import {Test} from "forge-std/Test.sol";
// import {FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
// import {Treasury} from "../src/Euler/Treasury.sol";
// import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract MultiVaultTest is Test {
//     FlashArbitrageEngine public engine;
//     Treasury public treasury;
//     ZeroNFT public zeroNFT;
    
//     address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
//     address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
//     address public owner;
//     address public user1;
//     address public user2;
    
//     // Mock vault addresses
//     address public vault1 = address(0x1111);
//     address public vault2 = address(0x2222);
//     address public vault3 = address(0x3333);
//     address public vault4 = address(0x4444);
    
//     function setUp() public {
//         owner = makeAddr("owner");
//         user1 = makeAddr("user1");
//         user2 = makeAddr("user2");
        
//         vm.startPrank(owner);
        
//         // Deploy contracts
//         treasury = new Treasury();
//         zeroNFT = new ZeroNFT(
//             address(0x1234), // Mock oracle master
//             address(0x5678), // Mock reputation contract
//             address(0x9abc), // Mock car registry
//             address(0xdef0)  // Mock auction contract
//         );
//         engine = new FlashArbitrageEngine(
//             payable(address(0x1234)), // Mock EVC
//             address(0x5678),         // Mock EulerSwap
//             address(0x9abc),         // Mock EulerRouter
//             address(zeroNFT)
//         );
        
//         // Set treasury in engine
//         engine.setTreasury(address(treasury));
        
//         vm.stopPrank();
//     }
    
//     function testAddMultipleVaults() public {
//         vm.startPrank(owner);
        
//         // Add multiple WETH vaults
//         engine.addTokenVault(WETH, vault1);
//         engine.addTokenVault(WETH, vault2);
//         engine.addTokenVault(WETH, vault3);
        
//         // Add multiple USDC vaults
//         engine.addTokenVault(USDC, vault4);
        
//         // Verify vaults were added
//         address[] memory wethVaults = engine.getTokenVaults(WETH);
//         assertEq(wethVaults.length, 3);
//         assertEq(wethVaults[0], vault1);
//         assertEq(wethVaults[1], vault2);
//         assertEq(wethVaults[2], vault3);
        
//         address[] memory usdcVaults = engine.getTokenVaults(USDC);
//         assertEq(usdcVaults.length, 1);
//         assertEq(usdcVaults[0], vault4);
        
//         vm.stopPrank();
//     }
    
//     function testVaultScoringAndSelection() public {
//         vm.startPrank(owner);
        
//         // Add multiple WETH vaults
//         engine.addTokenVault(WETH, vault1);
//         engine.addTokenVault(WETH, vault2);
//         engine.addTokenVault(WETH, vault3);
        
//         // Set vault info with different characteristics
//         engine.updateVaultInfo(vault1, 1000000e18, 300, 50); // High liquidity, low rate, low utilization
//         engine.updateVaultInfo(vault2, 500000e18, 500, 75);  // Medium liquidity, medium rate, medium utilization
//         engine.updateVaultInfo(vault3, 2000000e18, 400, 80); // Very high liquidity, medium rate, high utilization
        
//         // Get best vault
//         address bestVault = engine.getBestVault(WETH);
        
//         // Vault1 should be best (high liquidity, low rate, low utilization)
//         assertEq(bestVault, vault1);
        
//         vm.stopPrank();
//     }
    
//     function testVaultInfoUpdate() public {
//         vm.startPrank(owner);
        
//         // Add vault
//         engine.addTokenVault(WETH, vault1);
        
//         // Update vault info
//         engine.updateVaultInfo(vault1, 1000000e18, 300, 50);
        
//         // Get vault info
//         FlashArbitrageEngine.VaultInfo memory info = engine.getVaultInfo(vault1);
//         assertEq(info.totalLiquidity, 1000000e18);
//         assertEq(info.borrowRate, 300);
//         assertEq(info.utilizationRate, 50);
//         assertTrue(info.isActive);
        
//         vm.stopPrank();
//     }
    
//     function testRemoveVault() public {
//         vm.startPrank(owner);
        
//         // Add multiple vaults
//         engine.addTokenVault(WETH, vault1);
//         engine.addTokenVault(WETH, vault2);
//         engine.addTokenVault(WETH, vault3);
        
//         // Remove middle vault
//         engine.removeTokenVault(WETH, vault2);
        
//         // Verify vault was removed
//         address[] memory vaults = engine.getTokenVaults(WETH);
//         assertEq(vaults.length, 2);
//         assertEq(vaults[0], vault1);
//         assertEq(vaults[1], vault3);
        
//         // Verify vault info is inactive
//         FlashArbitrageEngine.VaultInfo memory info = engine.getVaultInfo(vault2);
//         assertFalse(info.isActive);
        
//         vm.stopPrank();
//     }
    
//     function testBestVaultUpdatesWhenInfoChanges() public {
//         vm.startPrank(owner);
        
//         // Add vaults
//         engine.addTokenVault(WETH, vault1);
//         engine.addTokenVault(WETH, vault2);
        
//         // Initially vault1 is better
//         engine.updateVaultInfo(vault1, 1000000e18, 300, 50);
//         engine.updateVaultInfo(vault2, 500000e18, 500, 75);
        
//         address bestVault = engine.getBestVault(WETH);
//         assertEq(bestVault, vault1);
        
//         // Update vault2 to be better
//         engine.updateVaultInfo(vault2, 2000000e18, 200, 30);
        
//         // Now vault2 should be best
//         bestVault = engine.getBestVault(WETH);
//         assertEq(bestVault, vault2);
        
//         vm.stopPrank();
//     }
    
//     function testOnlyOwnerCanManageVaults() public {
//         vm.startPrank(user1);
        
//         // Should fail - not owner
//         vm.expectRevert();
//         engine.addTokenVault(WETH, vault1);
        
//         vm.expectRevert();
//         engine.removeTokenVault(WETH, vault1);
        
//         vm.expectRevert();
//         engine.updateVaultInfo(vault1, 1000000e18, 300, 50);
        
//         vm.stopPrank();
//     }
    
//     function testCannotAddDuplicateVault() public {
//         vm.startPrank(owner);
        
//         // Add vault
//         engine.addTokenVault(WETH, vault1);
        
//         // Try to add same vault again
//         vm.expectRevert("Vault already added");
//         engine.addTokenVault(WETH, vault1);
        
//         vm.stopPrank();
//     }
    
//     function testCannotRemoveNonExistentVault() public {
//         vm.startPrank(owner);
        
//         // Try to remove vault that doesn't exist
//         vm.expectRevert("Vault not found");
//         engine.removeTokenVault(WETH, vault1);
        
//         vm.stopPrank();
//     }
// } 