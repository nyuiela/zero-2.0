//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
import {EthereumVaultConnector} from "../src/Euler/vault/EthereumVaultConnector.sol";
import {EulerRouterFactory} from "../src/Euler/vault/EulerRouterFactory.sol";

contract DeployEularSwap is Script {
    FlashArbitrageEngine flashArbitrageEngine;
    EthereumVaultConnector vault;
    EulerRouterFactory routerfactory;

    // =========================
    // Token Addresses (Base)
    // =========================
    address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external returns (address engine) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address zeroNFT = vm.envAddress("NEXT_PUBLIC_ZERO_NFT_ADDRESS");

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);
        deployContractsNeededToDeployEngine();
        address _routerAdd = deployRouterfactory(deployer);
        // engine = deployEngine(address(vault),swap,_routerAdd, zeroNFT);
    }

    function deployContractsNeededToDeployEngine() internal {
        vault = new EthereumVaultConnector();
        routerfactory = new EulerRouterFactory(address(vault));
        // use the factor address to deploy router address
    }

    function deployRouterfactory(
        address _deployer
    ) internal returns (address _routeraddress) {
        return _routeraddress = routerfactory.deploy(_deployer);
    }

    function swap() internal {}

    function deployEngine(
        address _evc,
        address _swap,
        address _router,
        address _zero
    ) internal returns (address engine) {
        flashArbitrageEngine = new FlashArbitrageEngine(
            payable(_evc),
            address(_swap),
            address(_router),
            address(_zero)
        );

        engine = address(flashArbitrageEngine);
    }
}

// the EVC, the Router , evault
