//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {FlashArbitrageEngine} from "../src/Euler/FlashArbitriageEngine.sol";
import {EthereumVaultConnector} from "../src/Euler/vault/EthereumVaultConnector.sol";
import {EulerRouterFactory} from "../src/Euler/vault/EulerRouterFactory.sol";
// evc/=lib/evk-periphery/lib/ethereum-vault-connector/src/
// evk-periphery/=lib/evk-periphery/src/
// evk-test/=lib/evk-periphery/lib/euler-vault-kit/test/
// evk/=lib/evk-periphery/lib/euler-vault-kit/src/
// import {ScriptUtils} from "./utils/ScriptUtils.s.sol";
import {GenericFactory} from "evk/GenericFactory/GenericFactory.sol";
import {EulerRouter} from "euler-price-oracle/EulerRouter.sol";
import {IEVC} from "ethereum-vault-connector/interfaces/IEthereumVaultConnector.sol";
import {IEVault} from "evk/EVault/IEVault.sol";
import {EulerRouterFactory} from "../src/EulerRouterFactory/EulerRouterFactory.sol";
import {EscrowedCollateralPerspective} from "../src/Perspectives/deployed/EscrowedCollateralPerspective.sol";

pragma solidity ^0.8.0;

contract EVaultDeployer is ScriptUtils {
    function run()
        public
        broadcast
        returns (address oracleRouter, address eVault)
    {
        string memory inputScriptFileName = "07_EVault_input.json";
        string memory outputScriptFileName = "07_EVault_output.json";
        string memory json = getScriptFile(inputScriptFileName);
        address oracleRouterFactory = vm.parseJsonAddress(
            json,
            ".oracleRouterFactory"
        );
        bool deployRouterForOracle = vm.parseJsonBool(
            json,
            ".deployRouterForOracle"
        );
        address eVaultFactory = vm.parseJsonAddress(json, ".eVaultFactory");
        bool upgradable = vm.parseJsonBool(json, ".upgradable");
        address asset = vm.parseJsonAddress(json, ".asset");
        address oracle = vm.parseJsonAddress(json, ".oracle");
        address unitOfAccount = vm.parseJsonAddress(json, ".unitOfAccount");

        (oracleRouter, eVault) = execute(
            oracleRouterFactory,
            deployRouterForOracle,
            eVaultFactory,
            upgradable,
            asset,
            oracle,
            unitOfAccount
        );

        string memory object;
        if (deployRouterForOracle) {
            object = vm.serializeAddress(
                "eVault",
                "oracleRouter",
                oracleRouter
            );
        }
        object = vm.serializeAddress("eVault", "eVault", eVault);
        vm.writeJson(
            object,
            string.concat(vm.projectRoot(), "/script/", outputScriptFileName)
        );
    }

    function deploy(
        address oracleRouterFactory,
        bool deployRouterForOracle,
        address eVaultFactory,
        bool upgradable,
        address asset,
        address oracle,
        address unitOfAccount
    ) public broadcast returns (address oracleRouter, address eVault) {
        (oracleRouter, eVault) = execute(
            oracleRouterFactory,
            deployRouterForOracle,
            eVaultFactory,
            upgradable,
            asset,
            oracle,
            unitOfAccount
        );
    }

    function deploy(
        address eVaultFactory,
        bool upgradable,
        address asset,
        address oracle,
        address unitOfAccount
    ) public broadcast returns (address eVault) {
        (, eVault) = execute(
            address(0),
            false,
            eVaultFactory,
            upgradable,
            asset,
            oracle,
            unitOfAccount
        );
    }

    function deploy(
        address eVaultFactory,
        bool upgradable,
        address asset
    ) public broadcast returns (address eVault) {
        (, eVault) = execute(
            address(0),
            false,
            eVaultFactory,
            upgradable,
            asset,
            address(0),
            address(0)
        );
    }

    function execute(
        address oracleRouterFactory,
        bool deployRouterForOracle,
        address eVaultFactory,
        bool upgradable,
        address asset,
        address oracle,
        address unitOfAccount
    ) public returns (address oracleRouter, address eVault) {
        if (deployRouterForOracle) {
            EulerRouter _oracleRouter = EulerRouter(
                EulerRouterFactory(oracleRouterFactory).deploy(getDeployer())
            );
            _oracleRouter.govSetConfig(asset, unitOfAccount, oracle);
            oracleRouter = address(_oracleRouter);
        }

        eVault = address(
            GenericFactory(eVaultFactory).createProxy(
                address(0),
                upgradable,
                abi.encodePacked(
                    asset,
                    deployRouterForOracle ? oracleRouter : oracle,
                    unitOfAccount
                )
            )
        );
    }
}

contract EVaultSingletonEscrowDeployer is ScriptUtils {
    function run() public broadcast returns (address eVault) {
        string
            memory inputScriptFileName = "07_EVaultSingletonEscrow_input.json";
        string
            memory outputScriptFileName = "07_EVaultSingletonEscrow_output.json";
        string memory json = getScriptFile(inputScriptFileName);
        address evc = vm.parseJsonAddress(json, ".evc");
        address escrowedCollateralPerspective = vm.parseJsonAddress(
            json,
            ".escrowedCollateralPerspective"
        );
        address eVaultFactory = vm.parseJsonAddress(json, ".eVaultFactory");
        address asset = vm.parseJsonAddress(json, ".asset");

        eVault = execute(
            evc,
            escrowedCollateralPerspective,
            eVaultFactory,
            asset
        );

        string memory object;
        object = vm.serializeAddress("eVault", "eVaultSingletonEscrow", eVault);
        vm.writeJson(
            object,
            string.concat(vm.projectRoot(), "/script/", outputScriptFileName)
        );
    }

    function deploy(
        address evc,
        address escrowedCollateralPerspective,
        address eVaultFactory,
        address asset
    ) public broadcast returns (address eVault) {
        eVault = execute(
            evc,
            escrowedCollateralPerspective,
            eVaultFactory,
            asset
        );
    }

    function execute(
        address evc,
        address escrowedCollateralPerspective,
        address eVaultFactory,
        address asset
    ) public returns (address eVault) {
        eVault = EscrowedCollateralPerspective(escrowedCollateralPerspective)
            .singletonLookup(asset);

        if (eVault == address(0)) {
            eVault = address(
                GenericFactory(eVaultFactory).createProxy(
                    address(0),
                    true,
                    abi.encodePacked(asset, address(0), address(0))
                )
            );

            address deployer = getDeployer();
            IEVC.BatchItem[] memory items = new IEVC.BatchItem[](3);
            items[0] = IEVC.BatchItem({
                targetContract: eVault,
                onBehalfOfAccount: deployer,
                value: 0,
                data: abi.encodeCall(
                    IEVault(eVault).setHookConfig,
                    (address(0), 0)
                )
            });
            items[1] = IEVC.BatchItem({
                targetContract: eVault,
                onBehalfOfAccount: deployer,
                value: 0,
                data: abi.encodeCall(
                    IEVault(eVault).setGovernorAdmin,
                    (address(0))
                )
            });
            items[2] = IEVC.BatchItem({
                targetContract: escrowedCollateralPerspective,
                onBehalfOfAccount: deployer,
                value: 0,
                data: abi.encodeCall(
                    EscrowedCollateralPerspective(escrowedCollateralPerspective)
                        .perspectiveVerify,
                    (eVault, true)
                )
            });
            IEVC(evc).batch(items);
        }
    }
}

contract OracleRouterDeployer is ScriptUtils {
    function run() public broadcast returns (address oracleRouter) {
        string memory inputScriptFileName = "07_OracleRouter_input.json";
        string memory outputScriptFileName = "07_OracleRouter_output.json";
        string memory json = getScriptFile(inputScriptFileName);
        address oracleRouterFactory = vm.parseJsonAddress(
            json,
            ".oracleRouterFactory"
        );

        oracleRouter = execute(oracleRouterFactory);

        string memory object;
        object = vm.serializeAddress(
            "oracleRouter",
            "oracleRouter",
            oracleRouter
        );
        vm.writeJson(
            object,
            string.concat(vm.projectRoot(), "/script/", outputScriptFileName)
        );
    }

    function deploy(
        address oracleRouterFactory
    ) public broadcast returns (address oracleRouter) {
        oracleRouter = execute(oracleRouterFactory);
    }

    function execute(
        address oracleRouterFactory
    ) public returns (address oracleRouter) {
        oracleRouter = EulerRouterFactory(oracleRouterFactory).deploy(
            getDeployer()
        );
    }
}

contract DeployEularSwap is Script {
    FlashArbitrageEngine flashArbitrageEngine;
    EthereumVaultConnector vault;
    EulerRouterFactory routerfactory;
    EVaultDeployer evaultDeployer;

    // =========================
    // Token Addresses (Base)
    // =========================
    address public constant WETH = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    // =========================
    // Arbitrage Engine Config
    // =========================
    uint256 public constant MAX_CYCLES = 10;
    uint256 public constant MAX_BORROW_AMOUNT = 1_000_000e6; // 1M USDC
    uint256 public constant MIN_PROFIT_THRESHOLD = 100e6; // 100 USDC
    uint256 public constant MAX_SLIPPAGE_BPS = 50; // 0.5%
    uint256 public constant GAS_PRICE_LIMIT = 50 gwei;
    uint256 public constant MAX_GAS_PER_CYCLE = 500_000;

    function run() external returns (address engine) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address zeroNFT = vm.envAddress("NEXT_PUBLIC_ZERO_NFT_ADDRESS");

        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast(deployerPrivateKey);
        deployContractsNeededToDeployEngine();
        address _routerAdd = deployRouterfactory(deployer);
        engine = deployEngine(address(vault), address(_routerAdd), zeroNFT);

        vm.stopBroadcast();
        console2.log("egine was deployed at ", address(engine));
        setConfigurationNeeded /**evault address */();
    }

    // deploy oracle and evault
    function deployEvault()
        interal
        returns (address oracleRouter, address evault)
    {
        evaultDeployer = new EVaultDeployer();
        (oracleRouter, evault) = evaultDeployer.deploy();
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

    function deployEngine(
        address _evc,
        /* address _swap,*/
        address _router,
        address _zero
    ) internal returns (address engine) {
        flashArbitrageEngine = new FlashArbitrageEngine(
            payable(_evc),
            address(_router),
            address(_zero)
        );

        engine = address(flashArbitrageEngine);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////// Setting all neded configs ////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setConfigurationNeeded(address _evaultAddress) internal {
        flashArbitrageEngine.updateConfig(
            MAX_CYCLES,
            MAX_BORROW_AMOUNT,
            MIN_PROFIT_THRESHOLD,
            MAX_SLIPPAGE_BPS
        );

        flashArbitrageEngine.updateGasConfig(
            GAS_PRICE_LIMIT,
            MAX_GAS_PER_CYCLE
        );
        flashArbitrageEngine.setEvaultAddress(_evaultAddress);
    }

    // discorver pools and add pulls to the engine

    // function discoverpools()
    //     internal
    //     returns (address[] memory discoveredPools)
    // {}

    // function addPools() internal {

    //     flashArbitrageEngine.add
    // }

    ////////////////////////////////////////////////////
    /// deploy our own swap factory and find vaults////
    //////////////////////////////////////////////////
}

// the EVC, the Router , evault
