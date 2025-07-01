// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IOracleMaster} from "../Interface/oracle/IOracleMaster.sol";
import {Reputation} from "../core/reputation.sol";
import {ICarRegistry} from "../Interface/ICarRegistry.sol";
import {IZeroNFT} from "../interface/IZeronft.sol";

/**
 * @title ZeroNFT
 * @dev RWA Tokenization NFT contract for car brands that have completed registration and protocol procedures
 * Only registered and active car brands can mint NFTs representing their real-world assets
 */
contract ZeroNFT is
    IZeroNFT,
    ERC721,
    ERC721URIStorage,
    Ownable,
    ReentrancyGuard
{
    ICarRegistry carRegistry;
    // Token ID counter (replaces deprecated Counters library)
    uint256 private _tokenIdCounter;

    // Transfer fee (percentage in basis points, 100 = 1%)
    uint256 public transferFee = 0;

    // Base URI for token metadata
    string private _baseTokenURI;

    // Transfer cooldown period (in seconds)
    uint256 public transferCooldown = 0;

    // Protocol integration addresses
    address public oracleMaster;
    address public reputationContract;
    // address public carRegistry;

    // Mapping to track last transfer time for each token
    mapping(uint256 => uint256) private _lastTransferTime;

    // Mapping to track if a token is locked (cannot be transferred)
    mapping(uint256 => bool) private _lockedTokens;

    // Mapping to track brand ownership of NFTs
    mapping(uint256 => string) private _tokenToBrand;
    mapping(string => uint256[]) private _brandToTokens;

    // Mapping to track NFT metadata
    mapping(uint256 => NFTMetadata) private _nftMetadata;

    // Struct for NFT metadata
    // struct NFTMetadata {
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

    // Events
    event NFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        string brandName,
        string tokenURI
    );
    event BaseURIUpdated(string newBaseURI);
    event TransferFeeUpdated(uint256 newFee);
    event TransferCooldownUpdated(uint256 newCooldown);
    event TokenLocked(uint256 indexed tokenId, bool locked);
    event BatchTransfer(
        address indexed from,
        address indexed to,
        uint256[] tokenIds
    );
    event TransferFeeCollected(uint256 indexed tokenId, uint256 feeAmount);
    event BrandNFTMinted(
        string indexed brandName,
        uint256 indexed tokenId,
        address indexed brandOwner
    );
    event NFTVerified(uint256 indexed tokenId, bool verified);

    address auctionContract;

    constructor(
        address _oracleMaster,
        address _reputationContract,
        address _carRegistry,
        address _auctionContract
    ) ERC721("Zero", "ZERO") Ownable() {
        require(
            _oracleMaster != address(0),
            "ZeroNFT: Oracle master cannot be zero address"
        );
        require(
            _reputationContract != address(0),
            "ZeroNFT: Reputation contract cannot be zero address"
        );
        require(
            _carRegistry != address(0),
            "ZeroNFT: Car registry cannot be zero address"
        );

        auctionContract = _auctionContract;
        oracleMaster = _oracleMaster;
        reputationContract = _reputationContract;
        carRegistry = ICarRegistry(_carRegistry);
        _baseTokenURI = "";
        _tokenIdCounter = 0;
    }

    //so um if theyve gon through all the nessary steps but will mainly check activation since it means theyve been through all steps
    function mint(
        address to,
        string memory brandName,
        NFTMetadata memory metadata,
        string memory tokenUri_
    ) public override returns (uint256) {
        // // Check if brand is registered and active
        // require(isBrandRegisteredAndActive(brandName), "ZeroNFT: Brand not registered or inactive");

        // // Check if brand has completed staking requirements
        // require(isBrandStaked(brandName), "ZeroNFT: Brand must complete staking requirements");

        // Check if caller is brand owner or has permission
        // require(
        //     msg.sender == to ||
        //     msg.sender == owner() ||
        //     hasBrandPermission(brandName, msg.sender),
        //     "ZeroNFT: Caller not authorized for this brand"
        // );
        CanMint(brandName);

        require(to != address(0), "ZeroNFT: Cannot mint to zero address");
        require(
            bytes(brandName).length > 0,
            "ZeroNFT: Brand name cannot be empty"
        );

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenUri_);
        _lastTransferTime[newTokenId] = block.timestamp;

        // Store brand association and metadata
        _tokenToBrand[newTokenId] = brandName;
        _brandToTokens[brandName].push(newTokenId);
        _nftMetadata[newTokenId] = metadata;
        _nftMetadata[newTokenId].mintTimestamp = block.timestamp;

        emit NFTMinted(to, newTokenId, brandName, tokenUri_);
        emit BrandNFTMinted(brandName, newTokenId, to);
        return newTokenId;
    }

    // @dev Mint multiple NFTs for a brand in a batch

    function mintBatch(
        address to,
        string memory brandName,
        NFTMetadata[] memory metadatas,
        string[] memory tokenURIs
    ) public override nonReentrant returns (uint256[] memory) {
        // Check if brand is registered and active
        // require(isBrandRegisteredAndActive(brandName), "ZeroNFT: Brand not registered or inactive");

        // // Check if brand has completed staking requirements
        // require(isBrandStaked(brandName), "ZeroNFT: Brand must complete staking requirements");

        // Check if caller is brand owner or has permission
        // require(
        //     msg.sender == to ||
        //     msg.sender == owner() ||
        //     hasBrandPermission(brandName, msg.sender),
        //     "ZeroNFT: Caller not authorized for this brand"
        // );

        require(to != address(0), "ZeroNFT: Cannot mint to zero address");
        require(
            metadatas.length == tokenURIs.length,
            "ZeroNFT: Arrays length mismatch"
        );
        require(metadatas.length > 0, "ZeroNFT: Empty metadata array");
        require(metadatas.length <= 50, "ZeroNFT: Too many NFTs in batch");

        uint256[] memory newTokenIds = new uint256[](metadatas.length);

        for (uint256 i = 0; i < metadatas.length; i++) {
            _tokenIdCounter++;
            uint256 newTokenId = _tokenIdCounter;
            CanMint(brandName);

            _safeMint(to, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            _lastTransferTime[newTokenId] = block.timestamp;

            // Store brand association and metadata
            _tokenToBrand[newTokenId] = brandName;
            _brandToTokens[brandName].push(newTokenId);
            _nftMetadata[newTokenId] = metadatas[i];
            _nftMetadata[newTokenId].mintTimestamp = block.timestamp;

            newTokenIds[i] = newTokenId;
            emit NFTMinted(to, newTokenId, brandName, tokenURIs[i]);
            emit BrandNFTMinted(brandName, newTokenId, to);
        }

        return newTokenIds;
    }

    // Brand Verification Functions

    //ckeck if brand has an active running oracle
    function isBrandRegisteredAndActive(
        string memory brandName
    ) public view override returns (bool) {
        try IOracleMaster(oracleMaster).isOracleActive(brandName) returns (
            bool isActive
        ) {
            return isActive;
        } catch {
            return false;
        }
    }

    function isBrandActive(
        string memory brandName
    ) public view override returns (bool) {
        // TODO: Implement actual activation logic or remove this stub
        // Removed invalid call
        return carRegistry.isActivate(brandName);
    }

    /**
     * @dev Check if a brand has completed staking requirements
     * @param brandName The name of the brand to check
     */

    function CanMint(
        string memory brandName
    ) public view override returns (bool) {
        // This would need to be implemented based on your reputation contract
        // For now, we'll assume all registered brands are staked
        // will replace with the actiavtion logic after kaleel is done
        //@Todo
        return
            isBrandRegisteredAndActive(brandName) && isBrandActive(brandName);
    }

    // function hasBrandPermission(string memory brandName, address account) public view returns (bool) {
    //     // This would need to be implemented based on your permission system
    //     // For now, we'll allow the contract owner
    //     return account == owner();
    // }

    // users can call this to chek if owner is the actual owner
    function verifyNFT(uint256 tokenId, bool verified) public override {
        require(_exists(tokenId), "ZeroNFT: Token does not exist");
        _nftMetadata[tokenId].isVerified = verified;
        emit NFTVerified(tokenId, verified);
    }

    // Transfer Functions

    function transferZero(
        address from,
        address to,
        uint256 tokenId
    ) public payable override onlyAuction nonReentrant {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "ZeroNFT: Transfer caller is not owner nor approved"
        );
        require(!_lockedTokens[tokenId], "ZeroNFT: Token is locked");
        // require(block.timestamp >= _lastTransferTime[tokenId] + transferCooldown, "ZeroNFT: Transfer cooldown not met");

        //   uint256 feeAmount = (transferFee * 0.01 ether) / 10000; // Calculate fee based on 0.01 ether base
        //  require(msg.value >= feeAmount, "ZeroNFT: Insufficient transfer fee");

        _transfer(from, to, tokenId);
        _lastTransferTime[tokenId] = block.timestamp;
    }

    /**
     * @dev Batch transfer multiple NFTs
     * @param from The address to transfer from
     * @param to The address to transfer to
     * @param tokenIds Array of token IDs to transfer
     */
    function batchTransfer(
        address from,
        address to,
        uint256[] memory tokenIds
    ) public override nonReentrant onlyAuction {
        require(to != address(0), "ZeroNFT: Cannot transfer to zero address");
        require(tokenIds.length > 0, "ZeroNFT: Empty token array");
        require(tokenIds.length <= 50, "ZeroNFT: Too many tokens in batch");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                _isApprovedOrOwner(msg.sender, tokenIds[i]),
                "ZeroNFT: Transfer caller is not owner nor approved"
            );
            require(!_lockedTokens[tokenIds[i]], "ZeroNFT: Token is locked");
            //   require(block.timestamp >= _lastTransferTime[tokenIds[i]] + transferCooldown, "ZeroNFT: Transfer cooldown not met");

            _transfer(from, to, tokenIds[i]);
            _lastTransferTime[tokenIds[i]] = block.timestamp;
        }

        emit BatchTransfer(from, to, tokenIds);
    }

    /**
     * @dev Safe batch transfer with data
     * @param from The address to transfer from
     * @param to The address to transfer to
     * @param tokenIds Array of token IDs to transfer
     * @param data Additional data to pass to the receiver
     */
    function safeBatchTransfer(
        address from,
        address to,
        uint256[] memory tokenIds,
        bytes memory data
    ) public onlyAuction nonReentrant {
        require(to != address(0), "ZeroNFT: Cannot transfer to zero address");
        require(tokenIds.length > 0, "ZeroNFT: Empty token array");
        require(tokenIds.length <= 50, "ZeroNFT: Too many tokens in batch");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                _isApprovedOrOwner(msg.sender, tokenIds[i]),
                "ZeroNFT: Transfer caller is not owner nor approved"
            );
            require(!_lockedTokens[tokenIds[i]], "ZeroNFT: Token is locked");
            //          require(block.timestamp >= _lastTransferTime[tokenIds[i]] + transferCooldown, "ZeroNFT: Transfer cooldown not met");

            _safeTransfer(from, to, tokenIds[i], data);
            _lastTransferTime[tokenIds[i]] = block.timestamp;
        }

        emit BatchTransfer(from, to, tokenIds);
    }

    // function emergencyTransfer(uint256 tokenId) public onlyOwner {
    //     address currentOwner = ownerOf(tokenId);
    //     require(currentOwner != address(0), "ZeroNFT: Token does not exist");

    //     _transfer(currentOwner, owner(), tokenId);
    //     _lastTransferTime[tokenId] = block.timestamp;
    // }

    // Token Management Functions

    //incase something happens and admin needs to step in and hold nft untill its resolved
    function setTokenLock(
        uint256 tokenId,
        bool locked
    ) public override onlyOwner {
        require(_exists(tokenId), "ZeroNFT: Token does not exist");
        _lockedTokens[tokenId] = locked;
        emit TokenLocked(tokenId, locked);
    }

    function isTokenLocked(
        uint256 tokenId
    ) public view override returns (bool) {
        return _lockedTokens[tokenId];
    }

    function getLastTransferTime(
        uint256 tokenId
    ) public view returns (uint256) {
        return _lastTransferTime[tokenId];
    }

    function canTransfer(uint256 tokenId) public view returns (bool) {
        if (!_exists(tokenId)) return false;
        if (_lockedTokens[tokenId]) return false;
        if (block.timestamp < _lastTransferTime[tokenId] + transferCooldown)
            return false;
        return true;
    }

    // Override transfer functions to add cooldown and lock checks

    /**
     * @dev Override transfer function to add cooldown and lock checks
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAuction {
        require(!_lockedTokens[tokenId], "ZeroNFT: Token is locked");
        //  require(block.timestamp >= _lastTransferTime[tokenId] + transferCooldown, "ZeroNFT: Transfer cooldown not met");

        super.transferFrom(from, to, tokenId);
        _lastTransferTime[tokenId] = block.timestamp;
    }

    /**
     * @dev Override safeTransferFrom function to add cooldown and lock checks
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override onlyAuction {
        require(!_lockedTokens[tokenId], "ZeroNFT: Token is locked");
        //  require(block.timestamp >= _lastTransferTime[tokenId] + transferCooldown, "ZeroNFT: Transfer cooldown not met");

        super.safeTransferFrom(from, to, tokenId, data);
        _lastTransferTime[tokenId] = block.timestamp;
    }

    /**
     * @dev Override safeTransferFrom function to add cooldown and lock checks
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAuction {
        require(!_lockedTokens[tokenId], "ZeroNFT: Token is locked");
        require(
            block.timestamp >= _lastTransferTime[tokenId] + transferCooldown,
            "ZeroNFT: Transfer cooldown not met"
        );

        super.safeTransferFrom(from, to, tokenId);
        _lastTransferTime[tokenId] = block.timestamp;
    }

    // View Functions

    /**
     * @dev Get the current token ID counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Get the total supply of minted NFTs
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function hasNFTs(address owner) public view returns (bool) {
        return balanceOf(owner) > 0;
    }

    // function getTokensOfOwner(address owner) public view returns (uint256[] memory) {
    //     uint256 tokenCount = balanceOf(owner);
    //     uint256[] memory tokens = new uint256[](tokenCount);

    //     for (uint256 i = 0; i < tokenCount; i++) {
    //         tokens[i] = tokenOfOwnerByIndex(owner, i);
    //     }

    //     return tokens;
    // }

    // function getTransferableTokens(address owner) public view returns (uint256[] memory) {
    //     uint256[] memory allTokens = getTokensOfOwner(owner);
    //     uint256 transferableCount = 0;

    //     // Count transferable tokens
    //     for (uint256 i = 0; i < allTokens.length; i++) {
    //         if (canTransfer(allTokens[i])) {
    //             transferableCount++;
    //         }
    //     }

    //     // Create array of transferable tokens
    //     uint256[] memory transferableTokens = new uint256[](transferableCount);
    //     uint256 index = 0;

    //     for (uint256 i = 0; i < allTokens.length; i++) {
    //         if (canTransfer(allTokens[i])) {
    //             transferableTokens[index] = allTokens[i];
    //             index++;
    //         }
    //     }

    //     return transferableTokens;
    // }

    /**
     * @dev Get NFT metadata
     * @param tokenId The token ID to get metadata for
     */
    function getNFTMetadata(
        uint256 tokenId
    ) public view returns (NFTMetadata memory) {
        require(_exists(tokenId), "ZeroNFT: Token does not exist");
        return _nftMetadata[tokenId];
    }

    /**
     * @dev Get brand name for a token
     * @param tokenId The token ID to get brand for
     */
    function getTokenBrand(
        uint256 tokenId
    ) public view returns (string memory) {
        require(_exists(tokenId), "ZeroNFT: Token does not exist");
        return _tokenToBrand[tokenId];
    }

    /**
     * @dev Get all tokens for a brand
     * @param brandName The brand name to get tokens for
     */
    function getBrandTokens(
        string memory brandName
    ) public view returns (uint256[] memory) {
        return _brandToTokens[brandName];
    }

    /**
     * @dev Get all registered brands
     */
    function getAllRegisteredBrands() public view returns (string[] memory) {
        try IOracleMaster(oracleMaster).getAllCarBrands() returns (
            string[] memory brands
        ) {
            return brands;
        } catch {
            return new string[](0);
        }
    }

    /**
     * @dev Get all active brands
     */
    function getActiveBrands() public view returns (string[] memory) {
        try IOracleMaster(oracleMaster).getActiveBrands() returns (
            string[] memory brands
        ) {
            return brands;
        } catch {
            return new string[](0);
        }
    }

    // Admin functions

    // function setTransferCooldown(uint256 newCooldown) public onlyOwner {
    //     require(newCooldown <= 7 days, "ZeroNFT: Cooldown too long (max 7 days)");
    //     transferCooldown = newCooldown;
    //     emit TransferCooldownUpdated(newCooldown);
    // }

    /**
     * @dev Update the base URI for token metadata (owner only)
     * @param newBaseURI The new base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Update protocol addresses (owner only)
     * @param _oracleMaster New oracle master address
     * @param _reputationContract New reputation contract address
     * @param _carRegistry New car registry address
     */
    function updateProtocolAddresses(
        address _oracleMaster,
        address _reputationContract,
        address _carRegistry
    ) public override onlyOwner {
        if (_oracleMaster != address(0)) oracleMaster = _oracleMaster;
        if (_reputationContract != address(0))
            reputationContract = _reputationContract;
        if (_carRegistry != address(0))
            carRegistry = ICarRegistry(_carRegistry);
    }

    function setAuctionContract(
        address _auctionContract
    ) external override onlyOwner {
        require(
            _auctionContract != address(0),
            "ZeroNFT: auction contract cannot be zero address"
        );
        auctionContract = _auctionContract;
    }

    // Override functions

    /**
     * @dev Override _baseURI to use custom base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Override tokenURI to use ERC721URIStorage
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    error ZeroNFT__cannot_burn();

    function _burn(
        uint256 /*tokenId*/
    ) internal pure override(ERC721, ERC721URIStorage) {
        revert ZeroNFT__cannot_burn();
        // super._burn(tokenId);
    }

    /**
     * @dev Override supportsInterface to include ERC721URIStorage
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyAuction() {
        require(
            msg.sender == address(auctionContract),
            "ZeroNFT: only auction can call"
        );
        _;
    }
}
