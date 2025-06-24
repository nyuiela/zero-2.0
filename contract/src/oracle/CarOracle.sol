// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../interfaces/ICarOracle.sol";

contract CarOracle is 
    ICarOracle, 
    Initializable, 
    OwnableUpgradeable, 
    PausableUpgradeable, 
    ReentrancyGuardUpgradeable 
{
    // State variables
    string private _brandName;
    string private _priceFeedAddress;
    address private _masterOracle;
    OracleConfig private _config;
    
    // Price data storage
    mapping(uint256 => PriceData) private _priceHistory;
    uint256 private _currentRoundId;
    uint256 private _lastUpdateTime;
    
    // Modifiers
    modifier onlyMasterOracle() {
        require(msg.sender == _masterOracle, "Only master oracle can call this");
        _;
    }
    
    modifier onlyValidPrice(uint256 price) {
        require(price >= _config.minAnswer && price <= _config.maxAnswer, "Price out of bounds");
        _;
    }
    
    modifier onlyValidUpdateInterval() {
        require(block.timestamp >= _lastUpdateTime + _config.updateInterval, "Update interval not met");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }


//@dev make it callable by masterOcale only
    function initialize(
        string memory brandName,
        string memory priceFeedAddress,
        OracleConfig memory config,
        address masterOracle
    ) external override initializer {
        require(bytes(brandName).length > 0, "Brand name cannot be empty");
        require(bytes(priceFeedAddress).length > 0, "Price feed address cannot be empty");
        require(masterOracle != address(0), "Master oracle cannot be zero address");
        
        _brandName = brandName;
        _priceFeedAddress = priceFeedAddress;
        _masterOracle = masterOracle;
        _config = config;
        _currentRoundId = 1;
        _lastUpdateTime = block.timestamp;
        
        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();
    }

    function updatePrice(uint256 newPrice) 
        external 
        override 
        onlyMasterOracle 
        onlyValidPrice(newPrice)
        onlyValidUpdateInterval
        whenNotPaused
        nonReentrant 
    {
        // Store the new price data
        PriceData memory newPriceData = PriceData({
            price: newPrice,
            timestamp: block.timestamp,
            roundId: _currentRoundId,
            isValid: true
        });
        
        _priceHistory[_currentRoundId] = newPriceData;
        _lastUpdateTime = block.timestamp;
        
        emit PriceUpdated(_currentRoundId, newPrice, block.timestamp, _brandName);
        
        _currentRoundId++;
    }

    function getLatestPrice() external view override returns (PriceData memory) {
        require(_currentRoundId > 1, "No price data available");
        return _priceHistory[_currentRoundId - 1];
    }

    function getPriceAtRound(uint256 roundId) external view override returns (PriceData memory) {
        require(roundId > 0 && roundId < _currentRoundId, "Invalid round ID");
        return _priceHistory[roundId];
    }

    function updateConfig(OracleConfig memory config) external override onlyMasterOracle {
        require(config.updateInterval > 0, "Update interval must be greater than 0");
        require(config.deviationThreshold > 0, "Deviation threshold must be greater than 0");
        require(config.heartbeat > 0, "Heartbeat must be greater than 0");
        require(config.minAnswer < config.maxAnswer, "Min answer must be less than max answer");
        
        _config = config;
        
        emit ConfigUpdated(
            config.updateInterval,
            config.deviationThreshold,
            config.heartbeat,
            block.timestamp
        );
    }

    function getConfig() external view override returns (OracleConfig memory) {
        return _config;
    }

    function getBrandName() external view override returns (string memory) {
        return _brandName;
    }

    function getPriceFeedAddress() external view override returns (string memory) {
        return _priceFeedAddress;
    }

    function getMasterOracle() external view override returns (address) {
        return _masterOracle;
    }

    function isStale() external view override returns (bool) {
        return block.timestamp > _lastUpdateTime + _config.heartbeat;
    }

    function getLastUpdateTime() external view override returns (uint256) {
        return _lastUpdateTime;
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Chainlink integration helper
    function getChainlinkPrice() external view returns (int256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(_priceFeedAddress);
        (, int256 price,, uint256 updatedAt,) = priceFeed.latestRoundData();
        
        require(updatedAt >= block.timestamp - _config.heartbeat, "Stale price feed");
        require(price > 0, "Invalid price");
        
        return price;
    }

    // Get price history range
    function getPriceHistoryRange(uint256 startRound, uint256 endRound) 
        external 
        view 
        returns (PriceData[] memory) 
    {
        require(startRound > 0 && endRound >= startRound && endRound < _currentRoundId, "Invalid range");
        
        uint256 length = endRound - startRound + 1;
        PriceData[] memory history = new PriceData[](length);
        
        for (uint256 i = 0; i < length; i++) {
            history[i] = _priceHistory[startRound + i];
        }
        
        return history;
    }

    // Get current round ID
    function getCurrentRoundId() external view returns (uint256) {
        return _currentRoundId;
    }
} 