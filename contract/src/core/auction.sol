// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "../../lib/foundry-chainlink-toolkit/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ZeroNFT} from "../tokens/ZeroNFT.sol";
import {CarRegistry} from "./registry.sol";
import {OracleMaster} from "../oracle/Oracle.sol";
import {AggregatorV3Interface} from "../../lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {ICarOracle} from "../Interface/oracle/IcarOracle.sol";

contract Auction {
    CarRegistry public carRegistry;
    uint256 public auctionCount;
    uint256 public constant COLLATERAL_PERCENT = 10; //@TODO brand should pick this during the creat auction
    ZeroNFT public zeroNFT;
    OracleMaster public oracleMaster;
    AggregatorV3Interface public ethUsdPriceFeed;
    AggregatorV3Interface public usdcUsdPriceFeed;

    mapping(address => bool) private received;

    struct AuctionItem {
        uint256 id;
        string brandName;
        address creator;
        uint256 startTime;
        uint256 endTime;
        uint256 initialBid;
        uint256 bidThreshold;
        address bidToken; // address(0) for ETH, ERC20 address for USDC
        bool thresholdReached;
        bool ended;
        address winner;
        uint256 winningBid;
        uint256 nftTokenId;
        mapping(address => uint256) stakes;
        address[] bidders;
        string proofHash; // Hash of the proof for verification
    }

    struct Bid {
        address bidder;
        uint256 amount;
        bool staked;
    }

    mapping(uint256 => AuctionItem) public auctions;
    mapping(uint256 => Bid[]) public auctionBids;

    event AuctionCreated(
        uint256 indexed auctionId,
        string brandName,
        uint256 startTime,
        uint256 endTime,
        uint256 initialBid,
        uint256 bidThreshold
    );
    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount,
        bool staked
    );
    event ThresholdReached(uint256 indexed auctionId);
    event AuctionEnded(
        uint256 indexed auctionId,
        address winner,
        uint256 winningBid
    );
    event CollateralForfeited(
        uint256 indexed auctionId,
        address forfeitedBidder,
        uint256 amount
    );
    event CollateralReturned(
        uint256 indexed auctionId,
        address bidder,
        uint256 amount
    );
    event StakesReturned(uint256 indexed auctionId);
    event AuctionInfoUpdated(
        uint256 indexed auctionId,
        uint256 newStartTime,
        uint256 newEndTime,
        uint256 newInitialBid,
        uint256 newBidThreshold,
        address newBidToken,
        uint256 newNftTokenId
    );

    modifier onlyActiveBrand(string memory brandName) {
        require(carRegistry.isActivate(brandName), "Brand is not active");
        _;
    }
    address owner;

    constructor(
        address payable _carRegistry,
        address _zeroNFT,
        address _oracleMaster,
        address _ethUsdFeed,
        address _usdcUsdFeed,
        address _deployer
    ) {
        owner = _deployer;
        carRegistry = CarRegistry(_carRegistry);
        zeroNFT = ZeroNFT(_zeroNFT);
        oracleMaster = OracleMaster(_oracleMaster);
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdFeed);
        usdcUsdPriceFeed = AggregatorV3Interface(_usdcUsdFeed);
    }

    function createAuction(
        string memory brandName,
        uint256 startTime,
        uint256 endTime,
        uint256 initialBid,
        uint256 bidThreshold,
        address bidToken,
        uint256 nftTokenId,
        string memory proofHash
    ) external onlyActiveBrand(brandName) {
        require(
            startTime >= block.timestamp,
            "Start time must be in the future"
        );
        require(endTime > startTime, "End time must be after start time");
        require(initialBid > 0, "Initial bid must be positive");
        require(
            bidThreshold > initialBid,
            "Threshold must be greater than initial bid"
        );
        require(zeroNFT.ownerOf(nftTokenId) == msg.sender, "Not NFT owner");
        require(
            keccak256(bytes(zeroNFT.getTokenBrand(nftTokenId))) ==
                keccak256(bytes(brandName)),
            "NFT not of brand"
        );
        require(!zeroNFT.isTokenLocked(nftTokenId), "NFT is locked");

        auctionCount++;
        AuctionItem storage a = auctions[auctionCount];
        a.id = auctionCount;
        a.brandName = brandName;
        a.creator = msg.sender;
        a.startTime = startTime;
        a.endTime = endTime;
        a.initialBid = initialBid;
        a.bidThreshold = bidThreshold;
        a.bidToken = bidToken;
        a.thresholdReached = false;
        a.ended = false;
        a.winner = address(0);
        a.winningBid = 0;
        a.nftTokenId = nftTokenId;
        a.proofHash = proofHash; // Store the proof hash for verification

        emit AuctionCreated(
            auctionCount,
            brandName,
            startTime,
            endTime,
            initialBid,
            bidThreshold
        );
    }

    function placeBid(uint256 auctionId, uint256 amount) external payable {
        AuctionItem storage a = auctions[auctionId];
        require(block.timestamp >= a.startTime, "Auction not started");
        require(block.timestamp < a.endTime, "Auction ended");
        require(!a.ended, "Auction already ended");
        uint256 numBids = auctionBids[auctionId].length;
        uint256 minBid = a.initialBid;
        if (numBids > 0) {
            minBid = auctionBids[auctionId][numBids - 1].amount + 1;
        }
        require(amount >= minBid, "Bid too low");

        // If threshold reached, require collateral
        bool requireStake = false;
        if (!a.thresholdReached && amount >= a.bidThreshold) {
            a.thresholdReached = true;
            emit ThresholdReached(auctionId);
        }
        if (a.thresholdReached) {
            uint256 requiredStake = (amount * COLLATERAL_PERCENT) / 100;
            if (a.bidToken == address(0)) {
                require(
                    msg.value >= requiredStake,
                    "Insufficient ETH collateral"
                );
                a.stakes[msg.sender] += msg.value;
            } else {
                require(msg.value == 0, "Send collateral in token, not ETH");
                IERC20(a.bidToken).transferFrom(
                    msg.sender,
                    address(this),
                    requiredStake
                );
                a.stakes[msg.sender] += requiredStake;
            }
            requireStake = true;
            // Track bidders for collateral return
            bool alreadyBidder = false;
            for (uint256 i = 0; i < a.bidders.length; i++) {
                if (a.bidders[i] == msg.sender) {
                    alreadyBidder = true;
                    break;
                }
            }
            if (!alreadyBidder) {
                a.bidders.push(msg.sender);
            }
        } else {
            require(msg.value == 0, "Do not send ETH before threshold");
        }

        auctionBids[auctionId].push(
            Bid({bidder: msg.sender, amount: amount, staked: requireStake})
        );
        emit BidPlaced(auctionId, msg.sender, amount, requireStake);
    }

    function endAuction(uint256 auctionId) external {
        AuctionItem storage a = auctions[auctionId];
        require(block.timestamp >= a.endTime, "Auction not ended yet");
        require(!a.ended, "Auction already ended");

        a.ended = true;

        // Determine winner (highest bidder)
        uint256 highestBid = 0;
        address highestBidder = address(0);

        for (uint256 i = 0; i < auctionBids[auctionId].length; i++) {
            if (auctionBids[auctionId][i].amount > highestBid) {
                highestBid = auctionBids[auctionId][i].amount;
                highestBidder = auctionBids[auctionId][i].bidder;
            }
        }

        a.winner = highestBidder;
        a.winningBid = highestBid;

        emit AuctionEnded(auctionId, highestBidder, highestBid);
    }

    function claimWin(uint256 auctionId) external payable {
        AuctionItem storage a = auctions[auctionId];
        require(a.ended, "Auction not ended");
        require(msg.sender == a.winner, "Not winner");
        require(a.winner != address(0), "No winner declared");
        require(!received[msg.sender], "already received");

        if (a.bidToken == address(0)) {
            require(msg.value >= a.winningBid, "Insufficient ETH payment");
        } else {
            require(msg.value == 0, "Do not send ETH for token auction");
            IERC20(a.bidToken).transferFrom(
                msg.sender,
                a.creator,
                a.winningBid
            );
        }

        // Mark that winner has claimed and register them
        received[msg.sender] = true;
        // TODO: Implement proper ownership registration
        // CarRegistry.registerUndernewOwner(a.brandName, subscriptionId, args); ///register car under new owner
        // Transfer NFT to winner
        zeroNFT.transferFrom(a.creator, msg.sender, a.nftTokenId);
    }

    function returnStakes(uint256 auctionId) external {
        AuctionItem storage a = auctions[auctionId];
        require(a.ended, "Auction not ended");
        require(a.winner == address(0), "Winner must claim first");

        // Return all stakes to bidders
        for (uint256 i = 0; i < a.bidders.length; i++) {
            address bidder = a.bidders[i];
            uint256 stake = a.stakes[bidder];
            if (stake > 0) {
                a.stakes[bidder] = 0;
                if (a.bidToken == address(0)) {
                    (bool sent, ) = bidder.call{value: stake}("");
                    if (sent) emit CollateralReturned(auctionId, bidder, stake);
                } else {
                    IERC20(a.bidToken).transfer(bidder, stake);
                    emit CollateralReturned(auctionId, bidder, stake);
                }
            }
        }

        emit StakesReturned(auctionId);
    }

    // function forfeitWinner(uint256 auctionId) external {
    //     AuctionItem storage a = auctions[auctionId];
    //     require(a.ended, "Auction not ended");
    //     require(msg.sender == a.creator, "Only creator can forfeit");
    //     require(a.winner != address(0), "No winner");
    //     // Forfeit winner's stake
    //     uint256 forfeited = a.stakes[a.winner];
    //     if (forfeited > 0) {
    //         a.stakes[a.winner] = 0;
    //         if (a.bidToken == address(0)) {
    //             (bool sent,) = a.creator.call{value: forfeited}("");
    //             if (sent) emit CollateralForfeited(auctionId, a.winner, forfeited);
    //         } else {
    //             IERC20(a.bidToken).transfer(a.creator, forfeited);
    //             emit CollateralForfeited(auctionId, a.winner, forfeited);
    //         }
    //     }
    //     // Find next highest bidder
    //     uint256 nextHighest = 0;
    //     address nextBidder = address(0);
    //     for (uint256 i = 0; i < auctionBids[auctionId].length; i++) {
    //         address bidder = auctionBids[auctionId][i].bidder;
    //         if (bidder != a.winner && auctionBids[auctionId][i].amount > nextHighest) {
    //             nextHighest = auctionBids[auctionId][i].amount;
    //             nextBidder = bidder;
    //         }
    //     }
    //     a.winner = nextBidder;
    //     a.winningBid = nextHighest;
    // }

    function cancelAuction(uint256 auctionId) external {
        AuctionItem storage a = auctions[auctionId];
        require(msg.sender == a.creator, "Only creator can cancel");
        require(block.timestamp <= a.startTime, "Auction  started");
        require(!a.ended, "Auction already ended");
        a.ended = true;
        // Return all stakes
        delete auctionId;
    } //@dev todo restructure should be a simle id deletion

    function updateAuctionInfo(
        uint256 auctionId,
        uint256 newStartTime,
        uint256 newEndTime,
        uint256 newInitialBid,
        uint256 newBidThreshold,
        address newBidToken,
        uint256 newNftTokenId
    ) external {
        AuctionItem storage a = auctions[auctionId];
        require(msg.sender == a.creator, "Only creator can update");
        require(block.timestamp <= a.startTime, "Auction started");
        require(!a.ended, "Auction already ended");
        require(
            newStartTime >= block.timestamp,
            "Start time must be in the future"
        );
        require(newEndTime > newStartTime, "End time must be after start time");
        require(newInitialBid > 0, "Initial bid must be positive");
        require(
            newBidThreshold > newInitialBid,
            "Threshold must be greater than initial bid"
        );
        require(zeroNFT.ownerOf(newNftTokenId) == msg.sender, "Not NFT owner");
        require(
            keccak256(bytes(zeroNFT.getTokenBrand(newNftTokenId))) ==
                keccak256(bytes(a.brandName)),
            "NFT not of brand"
        );
        require(!zeroNFT.isTokenLocked(newNftTokenId), "NFT is locked");
        a.startTime = newStartTime;
        a.endTime = newEndTime;
        a.initialBid = newInitialBid;
        a.bidThreshold = newBidThreshold;
        a.bidToken = newBidToken;
        a.nftTokenId = newNftTokenId;
        emit AuctionInfoUpdated(
            auctionId,
            newStartTime,
            newEndTime,
            newInitialBid,
            newBidThreshold,
            newBidToken,
            newNftTokenId
        );
    }

    function getNftPriceInUSD(
        uint256 nftTokenId
    ) public view returns (uint256 priceUSD) {
        string memory brand = zeroNFT.getTokenBrand(nftTokenId);
        address brandOracle = oracleMaster.getOracleAddress(brand);
        ICarOracle.PriceData memory priceData = ICarOracle(brandOracle)
            .getLatestPrice();
        require(priceData.isValid, "No valid price");
        return priceData.price;
    }

    function getNftPriceInETH(
        uint256 nftTokenId
    ) public view returns (uint256 priceETH) {
        uint256 priceUSD = getNftPriceInUSD(nftTokenId);
        (, int256 ethUsd, , , ) = ethUsdPriceFeed.latestRoundData();
        require(ethUsd > 0, "Invalid ETH/USD price");
        // priceUSD and ethUsd are both 8 decimals (Chainlink standard)
        // priceETH = priceUSD / ethUsd
        return (priceUSD * 1e18) / uint256(ethUsd);
    }

    function getNftPriceInUSDC(
        uint256 nftTokenId
    ) public view returns (uint256 priceUSDC) {
        uint256 priceUSD = getNftPriceInUSD(nftTokenId);
        (, int256 usdcUsd, , , ) = usdcUsdPriceFeed.latestRoundData();
        require(usdcUsd > 0, "Invalid USDC/USD price");
        // priceUSD and usdcUsd are both 8 decimals (Chainlink standard)
        // priceUSDC = priceUSD / usdcUsd
        return (priceUSD * 1e6) / uint256(usdcUsd); // USDC is 6 decimals
    }

    function claimMyStake(uint256 auctionId) external {
        AuctionItem storage a = auctions[auctionId];
        require(a.ended, "Auction not ended");
        require(a.winner == address(0), "Winner must claim first");

        uint256 stake = a.stakes[msg.sender];
        require(stake > 0, "No stake to claim");

        a.stakes[msg.sender] = 0;

        if (a.bidToken == address(0)) {
            (bool sent, ) = msg.sender.call{value: stake}("");
            require(sent, "Failed to send ETH");
        } else {
            IERC20(a.bidToken).transfer(msg.sender, stake);
        }

        emit CollateralReturned(auctionId, msg.sender, stake);
    }

    function setZeroNFT(address _zeroNFT) public onlyOwner {
        zeroNFT = ZeroNFT(_zeroNFT);
    }

    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == address(owner), "auction: authorized");
        _;
    }

    // a function that store the auction a timelock function , go back to to se ethe next in line highest stake
}

//@Todo add the state changes , registration of rewrite, merkle trees update, state update
