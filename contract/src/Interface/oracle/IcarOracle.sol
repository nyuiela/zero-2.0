// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface ICarOracle {
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        uint256 roundId;
        bool isValid;
    }

    struct OracleConfig {
        uint256 updateInterval;
        uint256 deviationThreshold;
        uint256 heartbeat;
        uint256 minAnswer;
        uint256 maxAnswer;
    }

    event PriceUpdated(uint256 indexed roundId, uint256 price, uint256 timestamp, string brandName);

    event ConfigUpdated(uint256 updateInterval, uint256 deviationThreshold, uint256 heartbeat, uint256 timestamp);

    function initialize(
        string memory brandName,
        address priceFeedAddress,
        OracleConfig memory config,
        address masterOracle
    ) external;

    function updatePrice(uint256 newPrice) external;

    function getLatestPrice() external view returns (PriceData memory);

    function getPriceAtRound(uint256 roundId) external view returns (PriceData memory);

    function updateConfig(OracleConfig memory config) external;

    function getConfig() external view returns (OracleConfig memory);

    function getBrandName() external view returns (string memory);

    function getPriceFeedAddress() external view returns (address);

    function getMasterOracle() external view returns (address);

    function isStale() external view returns (bool);

    function getLastUpdateTime() external view returns (uint256);
}
