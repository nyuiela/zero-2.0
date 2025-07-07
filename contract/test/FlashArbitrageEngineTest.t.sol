// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Test, console} from "forge-std/Test.sol";
import{FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
import{DeployFlashArbitrageEngine} from "../script/DeployEular.s.sol";

contract FlashArbitrageEngineTest is Test {
   FlashArbitrageEngine flashArbitrageEngine;
DeployFlashArbitrageEngine deployer;



   function setUp() public {
    // use deploy script
    deployer = new DeployFlashArbitrageEngine();

    //address the address of the flash arbitrage engine
    flashArbitrageEngine = FlashArbitrageEngine(payable(deployer.run()));

   }


}