// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "../lib/foundry-chainlink-toolkit/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "forge-std/Script.sol";
import {IOracleMaster} from "../src/interface/oracle/IOracleMaster.sol";
import {IReputation} from "../src/interface/IReputation.sol";
import {IMerkleVerifier} from "../src/interface/IMerkleVerifier.sol";
import {IProfile} from "../src/interface/IProfile.sol";
import {IStateManager} from "../src/interface/IStateManager.sol";
import "../src/interface/IProofSync.sol";
import {IInitFunction} from "../src/interface/IInitFunction.sol";
import {ICarRegistry} from "../src/interface/ICarRegistry.sol";
import {ICarOracle} from "../src/interface/oracle/IcarOracle.sol";

contract ContractConfig is Script {
    address constant CAR_REGISTRY = 0x48e56B204B9D8dE76FA8D9930422a77E095322C0;
    string constant BRANDNAME = "lesscars";
    address constant PERMISSIONADDRESS =
        0xf0830060f836B8d54bF02049E5905F619487989e;
    uint64 constant SUBSCRIPTIONID = 387;
    string constant URL =
        "https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1";

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying ......");
        console.log("Deployer address:", deployer);

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);

        registerMyCar();

        vm.stopBroadcast();
    }

    function registerMyCar() internal {
        string[] memory args = new string[](1);
        args[0] = "http://13.222.216.164:8080";

        ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
            updateInterval: 1 days,
            deviationThreshold: 1 days,
            heartbeat: 1 days,
            minAnswer: 0,
            maxAnswer: 6000
        });

        ICarRegistry(CAR_REGISTRY).registerBrand(
            BRANDNAME,
            config,
            PERMISSIONADDRESS,
            SUBSCRIPTIONID,
            URL,
            args
        );
    }
}
