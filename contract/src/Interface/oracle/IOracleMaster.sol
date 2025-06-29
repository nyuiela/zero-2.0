// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ICarOracle} from "./IcarOracle.sol";

interface IOracleMaster {
    struct CarBrand {
        string name;
        address oracleAddress;
        string priceFeedAddress;
        uint256 lastUpdateTime;
        bool isActive;
        uint256 totalProducts;
    }

    event CarBrandRegistered(
        string indexed brandName, address indexed oracleAddress, string priceFeedAddress, uint256 timestamp
    );

    event OracleUpdated(
        string indexed brandName, address indexed oracleAddress, uint256 lastUpdateTime, uint256 timestamp
    );

    event OracleDeactivated(string indexed brandName, address indexed oracleAddress, uint256 timestamp);

    function registerCarBrand(
        string memory brandName,
        string memory priceFeedAddress,
        ICarOracle.OracleConfig memory config,
        address brandOwner
    ) external returns (address oracleAddress, address permissionAddress);

    function updateOracle(string memory brandName, ICarOracle.OracleConfig memory config) external;

    function deactivateOracle(string memory brandName) external;

    function getCarBrand(string memory brandName) external view returns (CarBrand memory);

    function getAllCarBrands() external view returns (string[] memory);

    function getOracleAddress(string memory brandName) external view returns (address);

    function isOracleActive(string memory brandName) external view returns (bool);

    function getLastUpdateTime(string memory brandName) external view returns (uint256);

    function getActiveBrands() external view returns (string[] memory);
}
