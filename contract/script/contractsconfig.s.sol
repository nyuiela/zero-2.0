// SPDX-License-Identifier: MIT
import {IERC20} from "../lib/foundry-chainlink-toolkit/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "forge-std/Script.sol";
// import {CarRegistry} from "../core/registry.sol";
import {IOracleMaster} from "../src/interface/oracle/IOracleMaster.sol";
import {IReputation} from "../src/interface/IReputation.sol";
import {IMerkleVerifier} from "../src/interface/IMerkleVerifier.sol";
import {IProfile} from "../src/interface/IProfile.sol";
import {IStateManager} from "../src/interface/IStateManager.sol";
import "../src/interface/IProofSync.sol";
import {IInitFunction} from "../src/interface/IInitFunction.sol";

contract ContractConfig is Script {
    // IInitFunction public initFunction;

    uint32 constant GAS_LIMIT = 4365000;
    address constant INITFUNCTION_ADDRESS =
        0x8Fbbe003Eb050c430d3EE849e2F9716d6E6B9f81;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // address init_function = vm.envAddress("INITFUNCTION_ADDRESS ");
        //   address oraclemaster = vm.envAddress("ORACLE_MASTER_ADDRESS");
        // address reputationContract = vm.envAddress("REPUTATION_ADDRESS");
        //   address permissionManager = vm.envAddress("PERMISSION_MANAGER_ADDRESS");
        //   address brandPermissionManager = vm.envAddress(
        //       "BRAND_PERMISSION_MANAGER_ADDRESS"
        //   );

        //   address carRegistry = vm.envAddress("CAR_REGISTRY_ADDRESS");
        //   address carOracleAddress = vm.envAddress("CAR_ORACLE_ADDRESS");
        //   address profile = vm.envAddress("PROFILE_ADDRESS");
        //   address stateManager = vm.envAddress("STATEMANAGER_ADDRESS");
        // address merkle_verifier = vm.envUint("MERKLEVERIFIER_ADDRESS");
        // address proof_sync = vm.envUint("PROOFSYNC_ADDRESS ");
        // address crossToken = vm.envUint("CROSS_TOKEN_ADDRESS");
        // address sync_function = vm.envUint("SYNCFUNCTION_ADDRESS ");
        // address zeronft = vm.envUint("ZERO_NFT_ADDRESS ");
        // address auction = vm.envUint("AUCTION_ADDRESS ");
        // address statecheckfunction = vm.envUint("STATECHECKFUNCTION_ADDRESS ");

        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deploying ......");
        console.log("Deployer address:", deployer);

        vm.createSelectFork(vm.rpcUrl("basechain"));

        vm.startBroadcast(deployer);
        setContractConfig(INITFUNCTION_ADDRESS, GAS_LIMIT);
        vm.stopBroadcast();
    }

    function setContractConfig(
        address _init_function,
        uint32 gas_limit
    ) internal {
        IInitFunction(_init_function).setGasLimit(gas_limit);
        // 4365000
    }

    // function setStakeAmount(address _reputation, uint256 amount) internal {

    // }
}
