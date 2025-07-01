// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ICarOracle} from "./IcarOracle.sol";

interface IOracleMaster {
    struct CarBrand {
        string name;
        address oracleAddress;
        address priceFeedAddress;
        uint256 lastUpdateTime;
        bool isActive;
        uint256 totalProducts;
    }

    event CarBrandRegistered(
        string indexed brandName, address indexed oracleAddress, address priceFeedAddress, uint256 timestamp
    );

    event OracleUpdated(
        string indexed brandName, address indexed oracleAddress, uint256 lastUpdateTime, uint256 timestamp
    );

    event OracleDeactivated(string indexed brandName, address indexed oracleAddress, uint256 timestamp);

    function registerCarBrand(
        string memory brandName,
        address priceFeedAddress,
        ICarOracle.OracleConfig memory config,
        address brandOwner
    ) external returns (address, address);

    function updateOracle(string memory brandName, ICarOracle.OracleConfig memory config) external;

    function reactivateOracle(string memory brandName) external;

    function incrementProductCount(string memory brandName) external;

    function decrementProductCount(string memory brandName) external;

    function batchUpdatePrices(string[] memory brandNames, uint256[] memory prices) external;

    function deactivateOracle(string memory brandName) external;

    function getCarBrand(string memory brandName) external view returns (CarBrand memory);

    function getAllCarBrands() external view returns (string[] memory);

    function getOracleAddress(string memory brandName) external view returns (address);

    function isOracleActive(string memory brandName) external view returns (bool);

    function getLastUpdateTime(string memory brandName) external view returns (uint256);

    function getActiveBrands() external view returns (string[] memory);
}
