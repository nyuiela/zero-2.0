// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IZeroNFT {
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

    // Mint functions
    function mint(
        address to,
        string memory brandName,
        NFTMetadata memory metadata,
        string memory tokenUri_
    ) external returns (uint256);

    function mintBatch(
        address to,
        string memory brandName,
        NFTMetadata[] memory metadatas,
        string[] memory tokenURIs
    ) external returns (uint256[] memory);

    // Transfer functions
    function transferZero(
        address from,
        address to,
        uint256 tokenId
    ) external payable;

    function batchTransfer(
        address from,
        address to,
        uint256[] memory tokenIds
    ) external;

    // Verification
    function verifyNFT(uint256 tokenId, bool verified) external;

    // Locking
    function setTokenLock(uint256 tokenId, bool locked) external;

    function isTokenLocked(uint256 tokenId) external view returns (bool);

    // Cooldown & Transfer State
    function getLastTransferTime(
        uint256 tokenId
    ) external view returns (uint256);

    function canTransfer(uint256 tokenId) external view returns (bool);

    // Brand & Metadata views
    function getCurrentTokenId() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function hasNFTs(address owner) external view returns (bool);

    function getNFTMetadata(
        uint256 tokenId
    ) external view returns (NFTMetadata memory);

    function getTokenBrand(
        uint256 tokenId
    ) external view returns (string memory);

    function getBrandTokens(
        string memory brandName
    ) external view returns (uint256[] memory);

    function getAllRegisteredBrands() external view returns (string[] memory);

    function getActiveBrands() external view returns (string[] memory);

    // Brand checks
    function isBrandRegisteredAndActive(
        string memory brandName
    ) external view returns (bool);

    function isBrandActive(
        string memory brandName
    ) external view returns (bool);

    function CanMint(string memory brandName) external view returns (bool);

    // Admin setters
    function setBaseURI(string memory newBaseURI) external;

    function setAuctionContract(address _auctionContract) external;

    function updateProtocolAddresses(
        address _oracleMater,
        address reputation,
        address _carRegistry
    ) external;
}
