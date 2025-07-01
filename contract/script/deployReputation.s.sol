import "forge-std/Script.sol";
import {CarRegistry} from "../src/core/registry.sol";
import {Reputation} from "../src/core/reputation.sol";

contract DeployScript is Script {
    CarRegistry public carRegistry;
    Reputation public reputation;
    address constant _BASE_USDC_TOKEN = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address permissionManager = vm.envAddress("PERMISSION_MANAGER_ADDRESS");
        address oraclemaster = vm.envAddress("ORACLE_MASTER_ADDRESS");

        address stateManager = vm.envAddress("STATEMANAGER_ADDRESS");
        address brandPermissionManager = vm.envAddress("BRAND_PERMISSION_MANAGER_ADDRESS");

        address profile = vm.envAddress("PROFILE_ADDRESS");
        address sync_function = vm.envAddress("SYNCFUNCTION_ADDRESS ");
        address crossToken = vm.envAddress("CROSS_TOKEN_ADDRESS");
        address merkle_verifier = vm.envAddress("MERKLEVERIFIER_ADDRESS");
        address proof_sync = vm.envAddress("PROOFSYNC_ADDRESS ");
        address initfunction = vm.envAddress("INITFUNCTION_ADDRESS");

        vm.createSelectFork(vm.rpcUrl("basechain"));

        vm.startBroadcast(deployerPrivateKey);

        deploy(
            permissionManager,
            profile,
            stateManager,
            sync_function,
            crossToken,
            merkle_verifier,
            oraclemaster,
            proof_sync
        );
        vm.stopBroadcast();
    }

    function deploy(
        address _permissionManager,
        address _profile,
        address _stateManager,
        address _syncFunction,
        address _ccip,
        address _merkleVerifier,
        address _oracleMaster,
        address _proofSync
    ) internal {
        console.log("Deploying Reputation...");
        reputation = new Reputation(
            1, // required stake
            _BASE_USDC_TOKEN, // stake token
            address(0), // car registry - will be set after -- not needed anymore - leave out
            address(_permissionManager)
        );
        vm.makePersistent(address(reputation));
        console.log("Reputation deployed at:", address(reputation));

        // 14. Deploy Car Registry
        console.log("Deploying CarRegistry...");
        carRegistry = new CarRegistry(
            address(_profile),
            address(_stateManager),
            address(_syncFunction),
            address(_ccip),
            address(_merkleVerifier),
            payable((reputation)),
            address(_oracleMaster),
            address(_proofSync)
        );
        vm.makePersistent(address(carRegistry));
        console.log("CarRegistry deployed at:", address(carRegistry));
    }

    function setUp(address initfunction) internal {
        carRegistry.setInitFunction(address(initfunction));
    }
}
