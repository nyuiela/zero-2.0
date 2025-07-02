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
import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";
import {IZeroNFT} from "../src/interface/IZeronft.sol";
import {Auction} from "../src/core/auction.sol";
import {console2} from "forge-std/Console2.sol";

contract IntergrationTest is Test {
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

    address usdcToken = address(0x23); // @to deploy a mock bid token

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
        initFunction = new MockInitFunction(address(registry));
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

    function registerbrand() internal {
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

        IZeroNFT.NFTMetadata memory meta = IZeroNFT.NFTMetadata({
            brandName: brand,
            carModel: "lambro567", //<--- i  know nothing about cars lol: Yooo which one is Lambro?? 😂
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
    }

    function stake(string memory brand) internal {
        registry.stake{value: 1}(brand);
    }

    function startActivation(string memory brand) internal {
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

    function mintnft(string memory brand, address owner) internal {
        string memory stateUrl = "https://state.url";
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

        zero.mint(owner, brand, meta, stateUrl);

        uint256 brandToken = zero.getCurrentTokenId();
    }

    function createAuction(string memory brand, address owner) internal {
        uint256 brandToken = zero.getCurrentTokenId();
        uint256 startTime = block.timestamp + 1 days;
        uint256 endTime = startTime + 4 days;
        uint256 curentIDForowner = zero.getCurrentTokenId();
        assertTrue(zero.isOwner(curentIDForowner, owner));
        zero.approve(address(auction), brandToken); // approve the auction contract to transfer the token on behalf of the owner
        auction.createAuction(
            brand,
            startTime,
            endTime,
            4 ether,
            30 ether,
            address(usdc),
            brandToken,
            "5t8gfydy" // - proof hash
        );
    }

    function bid(uint256 _auctionId, uint256 _amount) internal {
        // aprove contract to spend funds
        // write a function to check if the current bid is == to the tresshold and aprove the stake spend
        (uint256 currentBid, ) = auction.getCurrentHighestBid(_auctionId);
        uint256 bidthreshold = auction.getBidInfo(_auctionId);
        if (currentBid >= bidthreshold) {
            uint256 requiredStake = (_amount * 10) / 100;
            usdc._approve(address(auction), requiredStake); // stake amount
            auction.placeBid(_auctionId, _amount);
        } else {
            auction.placeBid(_auctionId, _amount);
        }
    }

    function test_registerBrand() public {
        address kaleel = makeAddr("kaleel");
        vm.prank(kaleel);
        registerbrand();
    }

    function test_stakeAndActivate() public {
        string memory brand = "TestBrand";
        address kaleel = makeAddr("kaleel");
        vm.deal(kaleel, 20 ether); // Give kaleel some funds to stake
        vm.startPrank(kaleel);
        registerbrand();

        // Stake the brand
        stake("TestBrand");

        // Activate the brand
        startActivation("TestBrand");
        vm.stopPrank();
    }

    function test_bidOnAuction() public {
        address kaleel = makeAddr("kaleel");
        address lee = makeAddr("lee");
        address kal = makeAddr("kal");
        address pat = makeAddr("pat");
        address godknows = makeAddr("godknows");
        vm.deal(lee, 10 ether); // Give lee some funds to bid
        vm.deal(kal, 20 ether); // Give kal some funds to bid
        vm.deal(pat, 30 ether); // Give pat some funds to bid
        vm.deal(godknows, 50 ether); // Give godknows some
        vm.deal(kaleel, 100 ether); // Give kaleel some funds to register and stake
        vm.startPrank(kaleel);
        registerbrand();

        // Stake and activate the brand
        stake("TestBrand");
        startActivation("TestBrand");

        // Mint an NFT for the brand
        mintnft("TestBrand", kaleel);

        // Create an auction for the NFT
        createAuction("TestBrand", kaleel);

        // Bid on the auction
        uint256 auctionId = 1; // Assuming this is the first auction created
        vm.stopPrank();

        vm.warp(block.timestamp + 2 days);

        vm.startPrank(lee);
        bid(auctionId, 5 ether);

        vm.startPrank(kal);
        bid(auctionId, 6 ether);

        vm.startPrank(pat);
        bid(auctionId, 10 ether);
        vm.stopPrank();

        vm.startPrank(pat);
        bid(auctionId, 12 ether);
        vm.stopPrank();

        vm.startPrank(godknows);
        bid(auctionId, 15 ether);
        vm.stopPrank();

        // Check the highest bid
        (uint256 highestBid, address highestBidder) = auction
            .getCurrentHighestBid(auctionId);
        console2.log("Highest Bid: ", highestBid);
        vm.warp(block.timestamp + 3 days);
        vm.prank(kal);
        auction.endAuction(auctionId);

        vm.startPrank(highestBidder);
        deal(highestBidder, highestBid);
        usdc.mint(highestBidder, highestBid);
        usdc._approve(address(auction), highestBid);
        auction.claimWin(auctionId);
        vm.stopPrank();
        console2.log("winnnnnnner is:", highestBidder);

        assertEq(
            highestBidder,
            godknows,
            "Godknows should be the highest bidder"
        );
    }
}

contract MockInitFunction is InitFunction {
    constructor(
        //   address _stateAddr,
        address _registry
    ) InitFunction(_registry) {}

    function sendRequest(
        uint64,
        string[] calldata,
        string memory
    ) external view override onlyRegistry returns (bytes32) {
        return bytes32(uint256(123));
    }
}
