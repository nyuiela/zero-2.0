// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAuction {
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

    event AuctionCreated(
        uint256 indexed auctionId,
        string brandName,
        uint256 startTime,
        uint256 endTime,
        uint256 initialBid,
        uint256 bidThreshold
    );
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount, bool staked);
    event ThresholdReached(uint256 indexed auctionId);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 winningBid);
    event CollateralForfeited(uint256 indexed auctionId, address forfeitedBidder, uint256 amount);
    event CollateralReturned(uint256 indexed auctionId, address bidder, uint256 amount);
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

    function createAuction(
        string memory brandName,
        uint256 startTime,
        uint256 endTime,
        uint256 initialBid,
        uint256 bidThreshold,
        address bidToken,
        uint256 nftTokenId
    ) external;

    function placeBid(uint256 auctionId, uint256 amount) external payable;

    function endAuction(uint256 auctionId) external;

    function claimWin(uint256 auctionId) external payable;

    function returnStakes(uint256 auctionId) external;

    function cancelAuction(uint256 auctionId) external;

    function getNftPriceInUSD(uint256 nftTokenId) external view returns (uint256 priceUSD);

    function getNftPriceInETH(uint256 nftTokenId) external view returns (uint256 priceETH);

    function getNftPriceInUSDC(uint256 nftTokenId) external view returns (uint256 priceUSDC);

    function claimMyStake(uint256 auctionId) external;

    function setZeroNFT(address _zeroNFT) external;

    function setOwner(address _newOwner) external;

    function getCurrentHighestBid(uint256 _auctionId) external view returns (uint256 highestbid);
}
