//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/Console2.sol";

import {CarRegistry} from "../src/core/registry.sol";
import {StateManager} from "../src/core/State.sol";
import {Profile} from "../src/core/profile.sol";
import {Reputation} from "../src/core/reputation.sol";
import {Auction} from "../src/core/auction.sol";
import {Fee} from "../src/core/fee.sol";

import {BrandPermissionManager} from "../src/Permission/BrandPermissionManager.sol";
import {PermissionManager} from "../src/Permission/PermissionManager.sol";

import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";
import {IZeroNFT} from "../src/interface/IZeronft.sol";

import {OracleMaster} from "../src/oracle/Oracle.sol";
import {CarOracle} from "../src/oracle/CarOracle.sol";
import {ICarOracle} from "../src/Interface/oracle/IcarOracle.sol";

import {ProofSync} from "../src/chainlink/proofSync.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {Sync} from "../src/chainlink/sync_function.sol";
import {InitFunction} from "../src/chainlink/init_function.sol";
import {Messenger} from "../src/chainlink/messenging.sol";
import {StateCheckFunction} from "../src/chainlink/state_check_function.sol";

import {UsdcToken} from "./mocks/IUSDC.sol";

import {BaseTest} from "./BaseTest.t.sol";
import {CCIPLocalSimulatorFork} from "@chainlink/local/src/ccip/CCIPLocalSimulatorFork.sol";
import {BurnMintERC677Helper} from "@chainlink/local/src/ccip/BurnMintERC677Helper.sol";
import {Register} from "@chainlink/local/src/ccip/Register.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";

contract BaseTest is Test {
    string DESTINATION_RPC_URL = vm.envString("ETHERUM_URL");
    string SOURCE_RPC_URL = vm.envString("BASE_URL");
    uint256 destinationFork;
    uint256 sourceFork;
    CCIPLocalSimulatorFork ccipLocalSimulatorFork;
    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    BurnMintERC677Helper destinationCCIPBnMToken;
    BurnMintERC677Helper sourceCCIPBnMToken;
    IERC20 sourceLinkToken;
    IRouterClient sourceRouter;
    uint64 destinationChainSelector;
    uint64 sourceChainSelector;

    Fee fee;
    StateManager state;
    PermissionManager permissions;
    Profile profile;
    Sync sync;
    MerkleVerifier merkle;
    ProofSync proof;
    CrossToken cross;
    InitFunction init;
    Messenger messenger;
    StateCheckFunction stateCheck;
    CarRegistry registry;
    OracleMaster oracle;
    CarOracle carOracle;
    BrandPermissionManager brandPermission;
    UsdcToken usdc;
    Reputation reputation;

    ZeroNFT zero;
    Auction auction;

    // destination contracts
    MerkleVerifier d_merkle;
    Messenger d_messenger;

    string constant BRAND = "leeees1";
    address public lee = address(0x23);
    // Base Network Addresses
    address constant _BASE_ETH_USD_FEED =
        0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address constant _BASE_USDC_USD_FEED =
        0x7e860098F58bBFC8648a4311b374B1D669a2bc6B;
    address constant _BASE_USDC_TOKEN =
        0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant _BASE_ROUTER = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
    address constant _BASE_LINK_TOKEN =
        0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
    address constant _BASE_FUNCTION_ROUTER =
        0xf9B8fc078197181C841c296C876945aaa425B278;
    bytes32 constant _BASE_FUNCTION_DON_ID =
        0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;

    // ETHEREUM
    address _ETH_ROUTER;
    address _ETH_LINK_TOKEN;

    function setUp() public {
        // set up network and fork
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(address(this), 100 ether);
        ccipLocalSimulatorFork = new CCIPLocalSimulatorFork();
        vm.makePersistent(address(ccipLocalSimulatorFork));
        destinationFork = vm.createSelectFork(DESTINATION_RPC_URL);
        sourceFork = vm.createFork(SOURCE_RPC_URL); //sourceFork =
        Register.NetworkDetails
            memory destinationNetworkDetails = ccipLocalSimulatorFork
                .getNetworkDetails(block.chainid);
        _ETH_ROUTER = destinationNetworkDetails.routerAddress;
        _ETH_LINK_TOKEN = destinationNetworkDetails.linkAddress;

        destinationCCIPBnMToken = BurnMintERC677Helper(
            destinationNetworkDetails.ccipBnMAddress
        );
        vm.makePersistent(address(destinationCCIPBnMToken));
        destinationChainSelector = destinationNetworkDetails.chainSelector;
        //   vm.makePersistent(destinationChainSelector);
        vm.selectFork(sourceFork);
        Register.NetworkDetails
            memory sourceNetworkDetails = ccipLocalSimulatorFork
                .getNetworkDetails(block.chainid);

        sourceCCIPBnMToken = BurnMintERC677Helper(
            sourceNetworkDetails.ccipBnMAddress
        );
        //   vm.makePersistent(address(sourceCCIPBnMToken));
        sourceLinkToken = IERC20(sourceNetworkDetails.linkAddress);
        //   vm.makePersistent(address(sourceLinkToken));
        sourceRouter = IRouterClient(sourceNetworkDetails.routerAddress);

        // check source details
        assertEq(block.chainid, 84532, "Chain ID should match Base network");
        assertEq(
            sourceNetworkDetails.linkAddress,
            _BASE_LINK_TOKEN,
            "LINK address should match"
        );
        assertEq(
            sourceNetworkDetails.routerAddress,
            _BASE_ROUTER,
            "Router address should match"
        );

        // deploy contracts

        usdc = new UsdcToken();

        brandPermission = new BrandPermissionManager();

        // Initialize carOracle before using it
        carOracle = new CarOracle();
        permissions = new PermissionManager();
        profile = new Profile(address(permissions));
        state = new StateManager(address(profile), address(permissions));
        merkle = new MerkleVerifier();
        sync = new Sync();
        registry = new CarRegistry(
            address(profile),
            address(state),
            address(sync),
            address(cross),
            address(merkle),
            payable(address(reputation)),
            address(oracle),
            address(proof)
        );
        cross = new CrossToken(_BASE_ROUTER, _BASE_LINK_TOKEN);
        proof = new ProofSync(address(merkle), payable(cross));

        init = new InitFunction(address(registry));
        messenger = new Messenger(
            _BASE_ROUTER,
            _BASE_LINK_TOKEN,
            address(merkle)
        );
        stateCheck = new StateCheckFunction(address(state), payable(registry));

        oracle = new OracleMaster(
            address(carOracle),
            address(brandPermission),
            address(permissions)
        );

        reputation = new Reputation(
            1,
            address(usdc),
            address(registry),
            address(permissions)
        );

        zero = new ZeroNFT(
            address(oracle),
            address(reputation),
            address(registry),
            address(0) // auction
        );
        auction = new Auction(
            payable(registry),
            address(zero),
            address(oracle),
            _BASE_ETH_USD_FEED,
            _BASE_USDC_USD_FEED,
            address(this)
        );

        fee = new Fee(
            address(lee),
            address(auction),
            address(permissions),
            1 wei
        );

        //give permissions
        bytes4 functionSelector = state.initiate.selector;
        uint256 time = block.timestamp + 340 days;
        permissions.grantPermission(lee, functionSelector, time);

        // Grant all permissions from PermissionManager
        bytes4[] memory permissions_ = new bytes4[](20);
        bytes4[] memory registryPermissions = new bytes4[](20);
        bytes4[] memory statecalls = new bytes4[](3);

        statecalls[0] = profile.updateState.selector;
        statecalls[1] = profile.lockBrand.selector;
        statecalls[2] = profile.unlockBrand.selector;

        permissions_[0] = oracle.registerCarBrand.selector;
        permissions_[1] = oracle.updateOracle.selector;
        permissions_[2] = oracle.deactivateOracle.selector;
        permissions_[3] = oracle.reactivateOracle.selector;
        permissions_[4] = oracle.batchUpdatePrices.selector;
        permissions_[5] = oracle.incrementProductCount.selector;
        permissions_[6] = oracle.decrementProductCount.selector;

        permissions_[7] = reputation.SLASH();
        permissions_[8] = reputation.WITHDRAW_SLASHED_ETH();
        permissions_[9] = reputation.WITHDRAW_SLASHED_USDC();
        permissions_[10] = reputation.SET_STAKE_AMOUNT();

        permissions_[11] = fee.SET_FEE();
        permissions_[12] = fee.SET_FEE_RECEIVER();
        permissions_[13] = fee.WITHDRAW_FEE();

        permissions_[14] = profile.UPDATESTATE();
        permissions_[15] = profile.LOCKBRAND();
        permissions_[16] = profile.UNLOCKBRAND();

        permissions_[17] = state.SET_STATE();
        permissions_[18] = state.LOCK_CONTRACT();
        permissions_[19] = state.UNLOCK_CONTRACT();

        registryPermissions[0] = state.INITIATE();
        registryPermissions[1] = profile.UPDATESTATE();
        registryPermissions[2] = profile.LOCKBRAND();
        registryPermissions[3] = profile.UNLOCKBRAND();
        registryPermissions[4] = state.SET_STATE();
        registryPermissions[5] = state.LOCK_CONTRACT();
        registryPermissions[6] = state.UNLOCK_CONTRACT();
        registryPermissions[7] = state.INITIATE();

        permissions.grantPermission(
            address(registry),
            state.initiate.selector,
            block.timestamp + 365 days
        );
        permissions.grantPermission(
            address(registry),
            OracleMaster.registerCarBrand.selector,
            block.timestamp + 365 days
        );

        permissions.grantBatchPermissions(
            lee,
            permissions_,
            block.timestamp + 365 days
        );
        permissions.grantBatchPermissions(
            address(this),
            permissions_,
            block.timestamp + 365 days
        );
        permissions.grantBatchPermissions(
            address(registry),
            registryPermissions,
            block.timestamp + 365 days
        );

        // configs
        cross.allowlistDestinationChain(3676871237479449268, true); // sonic
        cross.allowlistDestinationChain(222782988166878823, true); // hedera
        cross.allowlistDestinationChain(16015286601757825753, true); // eth
        cross.allowlistDestinationChain(14767482510784806043, true); // avalanche
        init.setDon(_BASE_FUNCTION_DON_ID);
        registry.setInitFunction(address(init));
        profile.setRegistry(address(registry));
        zero.setAuctionContract(address(auction));
        init.transferOwnership(address(registry));
        proof.setMessenger(payable(messenger));
        profile.setRegistry(address(registry));

        // sync proof.
        proof.allowSyncPermission(address(sync));
        proof.allowSyncPermission(address(this));

        // initialize state
        vm.startPrank(lee);
        // initialize
        merkle.initialize("brand", "000", address(proof), address(this));
        state.initiate(BRAND);
        vm.stopPrank();

        vm.selectFork(destinationFork);
        d_merkle = new MerkleVerifier();
        d_merkle.setRegistry(address(registry));
        d_merkle.initialize("brand", "000", address(proof), address(this));
        d_messenger = new Messenger(
            _ETH_ROUTER,
            _ETH_LINK_TOKEN,
            address(d_merkle)
        );
        d_messenger.allowlistSourceChain(destinationChainSelector, true);
        d_messenger.allowlistDestinationChain(sourceChainSelector, true); // allowlist source chain on destination messenger
        vm.selectFork(sourceFork);
        proof.allowChain(destinationChainSelector, address(d_messenger));
        messenger.allowlistSourceChain(sourceChainSelector, true);
        messenger.allowlistDestinationChain(destinationChainSelector, true);
    }

    function prepareTest()
        public
        returns (
            // Client.EVMTokenAmount[] memory tokensToSendDetails,
            uint256 amountToSend
        )
    {
        // This function prepares the test
        vm.selectFork(sourceFork);
        //   sourceLinkToken.(address(messenger), 100 ether); // Ensure the router has enough LINK for fees
        vm.startPrank(alice);
        sourceCCIPBnMToken.drip(alice);

        amountToSend = 1;
        sourceCCIPBnMToken.approve(address(sourceRouter), amountToSend + 100);
        //   tokensToSendDetails = new Client.EVMTokenAmount[](1);
        //   Client.EVMTokenAmount memory tokenToSendDetails = Client
        //       .EVMTokenAmount({
        //           token: address(sourceCCIPBnMToken),
        //           amount: amountToSend
        //       });
        //   tokensToSendDetails[0] = tokenToSendDetails;
        vm.makePersistent(address(sourceRouter));
        ccipLocalSimulatorFork.requestLinkFromFaucet(
            address(messenger),
            100 ether
        );
        vm.stopPrank();
    }

    function testCCIPTransferToEth() public {
        prepareTest();
        proof.sendProof("testCCIPTransferOnBase1", bytes32("0x2342"));
        proof.sendProof("testCCIPTransferOnBase2", bytes32("0x2342"));
        proof.sendProof("testCCIPTransferOnBase3", bytes32("0x2342"));
        proof.sendProof("testCCIPTransferOnBase4", bytes32("0x2342"));
        proof.sendProof("testCCIPTransferOnBase5", bytes32("0x2342"));
    }

    function testRevertIfLeaveExists() public {
        // This test checks if the addLeaf function reverts if the leaf already exists
        vm.selectFork(sourceFork);
        //   vm.startPrank(lee);
        proof.sendProof("testRevertifLeaveExists1", bytes32("0x2342"));
        proof.sendProof("testRevertifLeaveExists1", bytes32("0x2342"));
        vm.expectRevert("MerkleVerifier: Already exist");
        vm.stopPrank();
    }

    function testProofSyncOnEth() public {
        // This test checks if the proof sync works correctly on Ethereum
        prepareTest();
        vm.selectFork(sourceFork);
        //   vm.startPrank(lee);
        proof.sendProof("testProofSyncOnEth1", bytes32("0x2342"));
        proof.sendProof("testProofSyncOnEth2", bytes32("0x2342"));
        vm.selectFork(destinationFork);
        // Check if the leaves were added correctly on the destination chain
        bytes32[] memory proofLeaves = d_merkle.getProof();
        // bool isInTree = d_merkle.verifyFromRoot(
        //     proofLeaves,
        //     "testProofSyncOnEth1"
        // );
        bool _state = d_merkle.isleaf("testProofSyncOnEth1");
        bool state2 = d_merkle.isleaf("testProofSyncOnEth2");
        assertTrue(_state, "Leaf should be in the tree");
        assertTrue(state2, "Leaf should be in the tree");

        //   assertEq(proofLeaves.length, 2, "Proof leaves should be 2");
    }

    /// check base function for test calls -- clean girl shi
}
