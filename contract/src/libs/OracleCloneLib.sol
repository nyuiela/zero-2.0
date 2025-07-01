// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {ICarOracle} from "../interface/oracle/IcarOracle.sol";

/*
 * @dev Library for creating and managing clones of car oracle contracts
 * This library provides functions to create clones, validate configurations,
 * and check price updates for car brands.
 * All zk verified braned will have to give their oracle address, each car brand has a unique price feed.
 * The manager contract will be the entry point and call point, or maybe i will change that idea once i get  deep in
 */
library OracleCloneLib {
    using Clones for address;

    /**
     * @dev Creates a new oracle clone for a car brand
     * @param implementation The implementation contract address
     * @param brandName The name of the car brand
     * @param priceFeedAddress The Chainlink price feed address
     * @param config The oracle configuration
     * @param masterOracle The master oracle address
     * @return cloneAddress The address of the newly created clone
     */
    function createOracleClone(
        address implementation,
        string memory brandName,
        address priceFeedAddress,
        ICarOracle.OracleConfig memory config,
        address masterOracle
    ) internal returns (address cloneAddress) {
        // Create the clone
        cloneAddress = implementation.clone();

        // Initialize the clone
        ICarOracle(cloneAddress).initialize(brandName, priceFeedAddress, config, masterOracle);
    }

    /**
     * @dev Predicts the address of a clone before creation
     * @param implementation The implementation contract address
     * @param salt The salt for deterministic address generation
     * @return predictedAddress The predicted address of the clone
     */
    function predictCloneAddress(address implementation, bytes32 salt)
        internal
        view
        returns (address predictedAddress)
    {
        return implementation.predictDeterministicAddress(salt);
    }

    /**
     * @dev Creates a new oracle clone with deterministic address
     * @param implementation The implementation contract address
     * @param salt The salt for deterministic address generation
     * @param brandName The name of the car brand
     * @param priceFeedAddress The Chainlink price feed address
     * @param config The oracle configuration
     * @param masterOracle The master oracle address
     * @return cloneAddress The address of the newly created clone
     */
    function createDeterministicOracleClone(
        address implementation,
        bytes32 salt,
        string memory brandName,
        address priceFeedAddress,
        ICarOracle.OracleConfig memory config,
        address masterOracle
    ) internal returns (address cloneAddress) {
        // Create the clone with deterministic address
        cloneAddress = implementation.cloneDeterministic(salt);

        // Initialize the clone
        ICarOracle(cloneAddress).initialize(brandName, priceFeedAddress, config, masterOracle);

        return cloneAddress;
    }

    /**
     * @dev Validates oracle configuration parameters
     * @param config The oracle configuration to validate
     */
    function validateOracleConfig(ICarOracle.OracleConfig memory config) internal pure {
        require(config.updateInterval > 0, "Update interval must be greater than 0");
        require(config.deviationThreshold > 0, "Deviation threshold must be greater than 0");
        require(config.heartbeat > 0, "Heartbeat must be greater than 0");
        require(config.minAnswer < config.maxAnswer, "Min answer must be less than max answer");
    }

    /**
     * @dev Checks if a price update is valid based on configuration
     * @param currentPrice The current price
     * @param newPrice The new price
     * @param config The oracle configuration
     * @return isValid Whether the price update is valid
     * @notice 10000 is used for precision
     */
    function isValidPriceUpdate(uint256 currentPrice, uint256 newPrice, ICarOracle.OracleConfig memory config)
        internal
        pure
        returns (bool isValid)
    {
        // Check if price is within bounds
        if (newPrice < config.minAnswer || newPrice > config.maxAnswer) {
            return false;
        }

        // Check if price deviation is within threshold
        if (currentPrice > 0) {
            uint256 deviation = newPrice > currentPrice
                ? ((newPrice - currentPrice) * 10000) / currentPrice
                : ((currentPrice - newPrice) * 10000) / currentPrice;

            if (deviation > config.deviationThreshold) {
                return false;
            }
        }

        return true;
    }
}
