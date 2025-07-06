// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "forge-std/Script.sol";
import {IOracleMaster} from "../src/Interface/oracle/IOracleMaster.sol";
import {IReputation} from "../src/Interface/IReputation.sol";
import {IMerkleVerifier} from "../src/Interface/IMerkleVerifier.sol";
import {IProfile} from "../src/Interface/IProfile.sol";
import {IStateManager} from "../src/Interface/IStateManager.sol";
import "../src/Interface/IProofSync.sol";
import {IInitFunction} from "../src/Interface/IInitFunction.sol";
import {ICarRegistry} from "../src/Interface/ICarRegistry.sol";
import {ICarOracle} from "../src/Interface/oracle/IcarOracle.sol";
import {ISync} from "../src/Interface/ISync.sol";
import {IPermissionManager} from "../src/Interface/Permissions/IPermissionManager.sol";
import {IAuction} from "../src/Interface/IAuction.sol";

contract ContractConfig is Script {
    address AUCTION_ADDRESS = vm.envAddress("");
    address CAR_REGISTRY = vm.envAddress("NEXT_PUBLIC_CAR_REGISTRY_ADDRESS");

    address SYNC_ADDRESS = vm.envAddress("NEXT_PUBLIC_SYNCFUNCTION_ADDRESS");
    address PERMISSION_ADDRESS =
        vm.envAddress("NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS");
    IPermissionManager permission = IPermissionManager(PERMISSION_ADDRESS);
    IProfile profile = IProfile(vm.envAddress("NEXT_PUBLIC_PROFILE_ADDRESS"));
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
        // registerMyCar();
        //   callSendRequest();

        vm.stopBroadcast();
    }

    function setInit() internal {
        string[] memory args = new string[](1);
        args[0] = "http://srv894182.hstgr.cloud/api/sync";
        ICarRegistry(CAR_REGISTRY).setInitFunction(
            0xfd2E0998d4285E890d8D4C8a76412e71ea2439B5
        );
    }

    //update to aa public function and add command to makefile
    function callSendRequest() internal {
        string[] memory args = new string[](1);
        args[0] = "1";
        ISync(SYNC_ADDRESS).sendRequest(SUBSCRIPTIONID, args);
    }
}

contract BrandInteraction is Script {
    address CAR_REGISTRY = vm.envAddress("NEXT_PUBLIC_CAR_REGISTRY_ADDRESS");

    address SYNC_ADDRESS = vm.envAddress("NEXT_PUBLIC_SYNCFUNCTION_ADDRESS");
    address PERMISSION_ADDRESS =
        vm.envAddress("NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS");
    IPermissionManager permission = IPermissionManager(PERMISSION_ADDRESS);
    IProfile profile = IProfile(vm.envAddress("NEXT_PUBLIC_PROFILE_ADDRESS"));
    string constant BRANDNAME1 = "lesscars123";

    address constant PERMISSIONADDRESS =
        0xccfC47DaC852fa570f2D92D198fD45177B12280b;
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
        vm.makePersistent(SYNC_ADDRESS);
        vm.makePersistent(PERMISSION_ADDRESS);

        vm.startBroadcast(deployerPrivateKey);
        //   setInit();
        registerMyCar();

        vm.stopBroadcast();
    }

    function setInit() internal {
        ICarRegistry(CAR_REGISTRY).setInitFunction(
            // 0xfd2E0998d4285E890d8D4C8a76412e71ea2439B5
            0xE2766BB943D16671621F98eeb354B5536e95d914
        );
    }

    function registerMyCar() internal {
        //  address zeronft = vm.envAddress("ZERO_NFT_ADDRESS ");

        string[] memory args = new string[](1);
        args[0] = "http:/srv894182.hstgr.cloud/api/sync";
        ICarRegistry(CAR_REGISTRY).setInitFunction(
            0xfd2E0998d4285E890d8D4C8a76412e71ea2439B5
        );
        permission.grantPermission(
            address(CAR_REGISTRY),
            IStateManager.initiate.selector,
            block.timestamp + 365 days
        );
        permission.grantPermission(
            address(CAR_REGISTRY),
            IOracleMaster.registerCarBrand.selector,
            block.timestamp + 365 days
        );
        ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
            updateInterval: 1 days,
            deviationThreshold: 500,
            heartbeat: 1 days,
            minAnswer: 0,
            maxAnswer: 6000
        });

        profile.setRegistry(CAR_REGISTRY);
        //   we regisster the brand
        ICarRegistry(CAR_REGISTRY).registerBrand(
            BRANDNAME1,
            config,
            PERMISSIONADDRESS,
            SUBSCRIPTIONID,
            URL,
            args
        );

        // stake an amount as collateral for any dispute/damages etc

        ICarRegistry(CAR_REGISTRY).stake{value: 0.0000002 ether}(BRANDNAME1);

        // We then activate the brand account

        ICarRegistry(CAR_REGISTRY).activate(BRANDNAME1);

        // check if it actually work

        assert(ICarRegistry(CAR_REGISTRY).isActivate(BRANDNAME1));

        //create an nft
    }
}
