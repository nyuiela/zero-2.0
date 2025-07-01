//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CarRegistry} from "../src/core/registry.sol";

import {ProofSync} from "../src/chainlink/proofSync.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {Profile} from "../src/core/profile.sol";
import {Reputation} from "../src/core/reputation.sol";
import {StateManager} from "../src/core/State.sol";
import {OracleMaster} from "../src/oracle/Oracle.sol";
import {CarOracle} from "../src/oracle/CarOracle.sol";
import {BrandPermissionManager} from "../src/Permission/BrandPermissionManager.sol";
import {PermissionManager} from "../src/Permission/PermissionManager.sol";
import {UsdcToken} from "./mocks/IUSDC.sol";
import {Sync} from "../src/chainlink/sync_function.sol";
import {ICarOracle} from "../src/Interface/oracle/IcarOracle.sol";
import {InitFunction} from "../src/chainlink/init_function.sol";
import {Sync} from "../src/chainlink/sync_function.sol";
import {ZeroNFT} from "src/tokens/ZeroNFT.sol";
import {IZeroNFT} from "src/interface/IZeronft.sol";
import {Auction} from "src/core/auction.sol";
import {console2} from "forge-std/Console2.sol";

contract ZeroNFTTest is Test {
    CarRegistry registry;
    Profile profile;
    StateManager state;
    Sync chainFunction;
    CrossToken ccip;
    MerkleVerifier merkleVerifier;
    OracleMaster oracle;
    ProofSync syncer;
    PermissionManager permission;
    CarOracle carOracle;
    BrandPermissionManager brandPermission;
    UsdcToken usdc;
    Reputation reputation;
    InitFunction initFunction;
    ZeroNFT zero;
    Auction auction;

    struct NFTMetadata {
        string brandName;
        string carModel;
        string vin;
        uint256 year;
        string color;
        uint256 mileage;
        string description;
        string imageURI;
        uint256 mintTimestamp;
        bool isVerified;
    }

    struct OracleConfig {
        uint256 updateInterval;
        uint256 deviationThreshold;
        uint256 heartbeat;
        uint256 minAnswer;
        uint256 maxAnswer;
    }

    address constant ROUTER = address(2);
    address constant LINK_TOKEN = address(2);

    function setUp() public {
        usdc = new UsdcToken();

        permission = new PermissionManager();
        brandPermission = new BrandPermissionManager();
        ccip = new CrossToken(ROUTER, LINK_TOKEN);
        merkleVerifier = new MerkleVerifier();
        merkleVerifier.initialize("brand", "000", address(0), address(0));

        // Initialize carOracle before using it
        carOracle = new CarOracle();

        // address _oracleImplementation
        // address _permissionManagerImplementation
        // address _globalPermissionManager
        profile = new Profile(address(permission));
        state = new StateManager(address(profile), address(permission));
        carOracle = new CarOracle();
        //   carOracle.initialize(
        //       "TestBrand",
        //       address(0), // Mock price feed address
        //       ICarOracle.OracleConfig({
        //           updateInterval: 3600,
        //           deviationThreshold: 100,
        //           heartbeat: 86400,
        //           minAnswer: 0,
        //           maxAnswer: 1000000
        //       }),
        //       address(oracle)
        //   );
        oracle = new OracleMaster(
            address(carOracle),
            address(brandPermission),
            address(permission)
        );
        syncer = new ProofSync(address(merkleVerifier), payable(ccip));
        merkleVerifier = new MerkleVerifier();
        merkleVerifier.initialize("brand", "000", address(0), address(0));

        reputation = new Reputation(
            1,
            address(usdc),
            address(registry),
            address(permission)
        );
        registry = new CarRegistry(
            address(profile),
            address(state),
            address(chainFunction),
            address(ccip),
            address(merkleVerifier),
            payable(address(reputation)),
            address(oracle),
            address(syncer)
        );
        profile.setRegistry(address(registry));
        permission.grantPermission(
            address(registry),
            state.initiate.selector,
            block.timestamp + 365 days
        );
        permission.grantPermission(
            address(registry),
            OracleMaster.registerCarBrand.selector,
            block.timestamp + 365 days
        );

        // Use the mock instead of the real InitFunction
        initFunction = new MockInitFunction(address(state), address(registry));
        registry.setInitFunction(address(initFunction));

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
            address(0x23),
            address(0x56),
            address(this)
        );
    }

    function testMinting() public {
        string memory brand = "TestBrand";

        address brandAdminAddr = address(0x123);
        uint64 subscriptionId = 1;
        string memory stateUrl = "https://state.url";
        string[] memory args = new string[](1);
        args[0] = "arg1";

        // Register the brand first
        ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
            updateInterval: 3600,
            deviationThreshold: 100,
            heartbeat: 86400,
            minAnswer: 0,
            maxAnswer: 1000000
        });

        //      struct NFTMetadata {
        //     string brandName;
        //     string carModel;
        //     string vin;
        //     uint256 year;
        //     string color;
        //     uint256 mileage;
        //     string description;
        //     string imageURI;
        //     uint256 mintTimestamp;
        //     bool isVerified;
        // }

        IZeroNFT.NFTMetadata memory meta = IZeroNFT.NFTMetadata({
            brandName: brand,
            carModel: "lambro567", //<--- i  know nothing about cars lol
            vin: "ytg",
            year: 567,
            color: "pink",
            mileage: 78,
            description: "very good car",
            imageURI: "stateUrl",
            mintTimestamp: block.timestamp,
            isVerified: true
        });

        registry.registerBrand(
            brand,
            config,
            brandAdminAddr,
            subscriptionId,
            stateUrl,
            args
        );

        // Stake the brand first (required for activation)

        registry.stake{value: 1}(brand); // i made a mistake here <----- the registry is the one sending the money lol not users
        // gotta fix
        //@fixed the issue

        // Activate the brand
        registry.activate(brand);

        // Check that status changed to ACTIVE (3)
        (, CarRegistry.Status status, , , , , , ) = registry.registry(brand);
        assertEq(
            uint256(status),
            3,
            "Brand status should be ACTIVE after activation"
        );

        // Check isActivate function
        assertTrue(
            registry.isActivate(brand),
            "isActivate should return true for active brand"
        );

        /// crreate Auction
        // but mint first
        uint256 current = zero.getCurrentTokenId();
        console2.log("lessToken:", current);
        address lee = address(0x56);
        zero.mint(lee, brand, meta, stateUrl);

        // verifier
        uint256 leeId = zero.getCurrentTokenId();
        console2.log("Curent Token ID is :", leeId);

        //check if lee is the owner
        vm.prank(lee);
        assertTrue(zero.isOwner(leeId));
    }

    function test_CanMint() public {
        string memory brand = "TestBrand";

        address brandAdminAddr = address(0x123);
        uint64 subscriptionId = 1;
        string memory stateUrl = "https://state.url";
        string[] memory args = new string[](1);
        args[0] = "arg1";

        // Register the brand first
        ICarOracle.OracleConfig memory config = ICarOracle.OracleConfig({
            updateInterval: 3600,
            deviationThreshold: 100,
            heartbeat: 86400,
            minAnswer: 0,
            maxAnswer: 1000000
        });

        //      struct NFTMetadata {
        //     string brandName;
        //     string carModel;
        //     string vin;
        //     uint256 year;
        //     string color;
        //     uint256 mileage;
        //     string description;
        //     string imageURI;
        //     uint256 mintTimestamp;
        //     bool isVerified;
        // }

        IZeroNFT.NFTMetadata memory meta = IZeroNFT.NFTMetadata({
            brandName: brand,
            carModel: "lambro567", //<--- i  know nothing about cars lol
            vin: "ytg",
            year: 567,
            color: "pink",
            mileage: 78,
            description: "very good car",
            imageURI: "stateUrl",
            mintTimestamp: block.timestamp,
            isVerified: true
        });

        registry.registerBrand(
            brand,
            config,
            brandAdminAddr,
            subscriptionId,
            stateUrl,
            args
        );

        // Stake the brand first (required for activation)

        registry.stake{value: 1}(brand); // i made a mistake here <----- the registry is the one sending the money lol not users
        // gotta fix
        //@fixed the issue

        // Activate the brand
        registry.activate(brand);

        // Check that status changed to ACTIVE (3)
        (, CarRegistry.Status status, , , , , , ) = registry.registry(brand);
        assertEq(
            uint256(status),
            3,
            "Brand status should be ACTIVE after activation"
        );

        // Check isActivate function
        assertTrue(
            registry.isActivate(brand),
            "isActivate should return true for active brand"
        );
    }
}

contract MockInitFunction is InitFunction {
    constructor(
        address _stateAddr,
        address _registry
    ) InitFunction(_stateAddr, _registry) {}

    function sendRequest(
        uint64,
        string[] calldata,
        string memory
    ) external view override onlyRegistry returns (bytes32) {
        return bytes32(uint256(123));
    }
}
