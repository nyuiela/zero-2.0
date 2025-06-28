// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import{ CrossToken} from "../src/chainlink/ccip.sol";

contract DeployCCIP is Script {
  CrossToken public ccip;

    address constant BASE_ROUTER = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
    address constant BASE_LINK_TOKEN = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;

    function run() public {

     uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts to hedera network...");
        console.log("Deployer address:", deployer);

          vm.createSelectFork(vm.rpcUrl("hederachain"));
        vm.startBroadcast(deployerPrivateKey);
           // 10. Deploy CCIP
        console.log("Deploying CrossToken (CCIP)...");
        ccip = new CrossToken(BASE_ROUTER, BASE_LINK_TOKEN);
        console.log("CrossToken deployed at:", address(ccip));
        vm.stopBroadcast();
    }

}