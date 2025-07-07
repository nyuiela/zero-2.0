// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Test, console} from "forge-std/Test.sol";
import {FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
import {DeployFlashArbitrageEngine} from "../script/DeployEular.s.sol";

contract FlashArbitrageEngineTest is Test {
    FlashArbitrageEngine flashArbitrageEngine;
    DeployFlashArbitrageEngine deployer;

    // hey ya good?
    function setUp() public {
        // use deploy script
        deployer = new DeployFlashArbitrageEngine();

        //address the address of the flash arbitrage engine
        flashArbitrageEngine = FlashArbitrageEngine(payable(deployer.run()));
    }

    // from docs

    //    vm.prank(admin);
    //     factory.setImplementation(evaultImpl);

    //     assetTST = new TestERC20("Test Token", "TST", 18, false);
    //     assetTST2 = new TestERC20("Test Token 2", "TST2", 18, false);

    //     eTST = IEVault(
    //         factory.createProxy(address(0), true, abi.encodePacked(address(assetTST), address(oracle), unitOfAccount))
    //     );
    //     eTST.setHookConfig(address(0), 0);
    //     eTST.setInterestRateModel(address(new IRMTestDefault()));
    //     eTST.setMaxLiquidationDiscount(0.2e4);
    //     eTST.setFeeReceiver(feeReceiver);

    //     eTST2 = IEVault(
    //         factory.createProxy(address(0), true, abi.encodePacked(address(assetTST2), address(oracle), unitOfAccount))
    //     );
    //     eTST2.setHookConfig(address(0), 0);
    //     eTST2.setInterestRateModel(address(new IRMTestDefault()));
    //     eTST2.setMaxLiquidationDiscount(0.2e4);
    //     eTST2.setFeeReceiver(feeReceiver);
    // }
}
