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
import {ISync} from "../src/interface/ISync.sol";

contract ContractConfig is Script {
    address constant CAR_REGISTRY = 0x14934Ed5cF8C816721fFB0CEEDE8c409bB9d010E;

    address constant SYNC_ADDRESS = 0xa9b7d51eA8FF6eD5D30fAf351516cb3AcF45507e;
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
        vm.makePersistent(CAR_REGISTRY);

        vm.startBroadcast(deployerPrivateKey);

        //  registerMyCar();
        //   callSendRequest();

        vm.stopBroadcast();
    }

    // function registerMyCar() internal {
    //     address zeronft = vm.envAddress("ZERO_NFT_ADDRESS ");

    //     string[] memory args = new string[](1);
    //     args[0] = "http://13.222.216.169:8080/api/sync";
    //     ICarRegistry(CAR_REGISTRY).setInitFunction(
    //         0xfd2E0998d4285E890d8D4C8a76412e71ea2439B5
    //     );

    //     ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
    //         updateInterval: 1 days,
    //         deviationThreshold: 1 days,
    //         heartbeat: 1 days,
    //         minAnswer: 0,
    //         maxAnswer: 6000
    //     });
    //     // we regisster the brand
    //     ICarRegistry(CAR_REGISTRY).registerBrand(
    //         BRANDNAME,
    //         config,
    //         PERMISSIONADDRESS,
    //         SUBSCRIPTIONID,
    //         URL,
    //         args
    //     );

    //     // stake an amount as collateral for any dispute/damages etc

    //     ICarRegistry(CAR_REGISTRY).stake(BRANDNAME);

    //     // We then activate the brand account

    //     ICarRegistry(CAR_REGISTRY).activate(BRANDNAME);

    //     // check if it actually work

    //     assert(ICarRegistry(CAR_REGISTRY).isActivate(BRANDNAME));

    //     //mint an nft
    //     //  zeroNFT.
    // }

    //update to aa public function and add command to makefile
    function callSendRequest() internal {
        string[] memory args = new string[](1);
        args[0] = "1";
        ISync(SYNC_ADDRESS).sendRequest(SUBSCRIPTIONID, args);
    }
}

contract BrandInteraction is Script {
    address constant CAR_REGISTRY = 0x14934Ed5cF8C816721fFB0CEEDE8c409bB9d010E;

    address constant SYNC_ADDRESS = 0xa9b7d51eA8FF6eD5D30fAf351516cb3AcF45507e;
    string constant BRANDNAME1 = "lesscars1";
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
        vm.makePersistent(CAR_REGISTRY);

        vm.startBroadcast(deployerPrivateKey);

        registerMyCar(deployer);

        vm.stopBroadcast();
    }

    function registerMyCar(address _deployer) internal {
        //  address zeronft = vm.envAddress("ZERO_NFT_ADDRESS ");

        string[] memory args = new string[](1);
        args[0] = "http://13.222.216.169:8080/api/sync";
        ICarRegistry(CAR_REGISTRY).setInitFunction(
            0xfd2E0998d4285E890d8D4C8a76412e71ea2439B5
        );

        ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
            updateInterval: 1 days,
            deviationThreshold: 1 days,
            heartbeat: 1 days,
            minAnswer: 0,
            maxAnswer: 6000
        });
        // we regisster the brand
        ICarRegistry(CAR_REGISTRY).registerBrand(
            BRANDNAME1,
            config,
            PERMISSIONADDRESS,
            SUBSCRIPTIONID,
            URL,
            args
        );

        // stake an amount as collateral for any dispute/damages etc

        ICarRegistry(CAR_REGISTRY).stake{value: 1}(BRANDNAME1, _deployer);

        // We then activate the brand account

        ICarRegistry(CAR_REGISTRY).activate(BRANDNAME1);

        // check if it actually work

        assert(ICarRegistry(CAR_REGISTRY).isActivate(BRANDNAME1));

        //mint an nft
        //  zeroNFT.

        // create an actuction
    }
}
