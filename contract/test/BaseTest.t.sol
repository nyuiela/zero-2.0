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

contract BaseTest is Test {
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

    function setUp() public {
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
        bytes4[] memory statecalls = new bytes4[](2);

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

        // initialize state
        vm.startPrank(lee);
        // initialize
        merkle.initialize("brand", "000", address(proof), address(this));
        state.initiate(BRAND);
    }

    /// check base function for test calls -- clean girl shi
}
