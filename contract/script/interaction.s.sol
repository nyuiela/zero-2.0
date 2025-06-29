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

contract ContractConfig is Script {
    address constant CAR_REGISTRY = 0x48e56B204B9D8dE76FA8D9930422a77E095322C0;
    string constant BRANDNAME = "lesscars";
    address constant PERMISSIONADDRESS =
        0xf0830060f836B8d54bF02049E5905F619487989e;
    uint256 constant SUBSCRIPTIONID = 1;
    string constant URL = "https://example.com";

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying ......");
        console.log("Deployer address:", deployer);

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployer);

        registerMyCar();

        vm.stopBroadcast();
    }

    function registerMyCar() internal {
        string;
        args[0] = "my car stshstst";
        args[1] = "its good";

        ICarRegistry.OracleConfig memory config = ICarRegistry.OracleConfig({
            updateInterval: block.timestamp + 1 days,
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
            args
        );
    }
}
