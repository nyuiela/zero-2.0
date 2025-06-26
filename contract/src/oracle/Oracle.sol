// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IOracleMaster} from "../Interface/oracle/IOracleMaster.sol";
import {ICarOracle} from "../Interface/oracle/IcarOracle.sol";
import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";
import {IBrandPermissionManager} from "../Interface/Permissions/IBrandPermissionManager.sol";
import {OracleCloneLib} from "../libs/OracleCloneLib.sol";
import {PermissionModifiers} from "../libs/PermissionModifier.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract OracleMaster is IOracleMaster, Ownable, Pausable, ReentrancyGuard {
    using OracleCloneLib for address;
    using Strings for string;
    using Clones for address;
    using PermissionModifiers for address;

    // State variables
    address public oracleImplementation;
    address public permissionManagerImplementation;
    address public globalPermissionManager;
    mapping(string => CarBrand) private _carBrands;
    string[] private _brandNames;
    mapping(address => string) private _oracleToBrand;
    mapping(address => string) private _permissionManagerToBrand;

    // Configuration
    uint256 public minUpdateInterval = 300; // 5 minutes
    uint256 public maxUpdateInterval = 86400; // 24 hours
    uint256 public minDeviationThreshold = 100; // 1%
    uint256 public maxDeviationThreshold = 5000; // 50%

    // Function selectors for permission management
    bytes4 public constant REGISTER_CAR_BRAND_SELECTOR =
        bytes4(keccak256("registerCarBrand(string,string,(uint256,uint256,uint256,uint256,uint256),address)"));
    bytes4 public constant UPDATE_ORACLE_SELECTOR =
        bytes4(keccak256("updateOracle(string,(uint256,uint256,uint256,uint256,uint256))"));
    bytes4 public constant DEACTIVATE_ORACLE_SELECTOR = bytes4(keccak256("deactivateOracle(string)"));
    bytes4 public constant REACTIVATE_ORACLE_SELECTOR = bytes4(keccak256("reactivateOracle(string)"));
    bytes4 public constant BATCH_UPDATE_PRICES_SELECTOR = bytes4(keccak256("batchUpdatePrices(string[],uint256[])"));
    bytes4 public constant INCREMENT_PRODUCT_COUNT_SELECTOR = bytes4(keccak256("incrementProductCount(string)"));
    bytes4 public constant DECREMENT_PRODUCT_COUNT_SELECTOR = bytes4(keccak256("decrementProductCount(string)"));

    // Events
    event OracleImplementationUpdated(address indexed oldImpl, address indexed newImpl);
    event PermissionManagerImplementationUpdated(address indexed oldImpl, address indexed newImpl);
    event GlobalPermissionManagerUpdated(address indexed oldManager, address indexed newManager);
    event BrandPermissionManagerCreated(
        string indexed brandName, address indexed permissionManager, address indexed brandOwner
    );
    event ConfigurationUpdated(
        uint256 minUpdateInterval,
        uint256 maxUpdateInterval,
        uint256 minDeviationThreshold,
        uint256 maxDeviationThreshold
    );

    constructor(
        address _oracleImplementation,
        address _permissionManagerImplementation,
        address _globalPermissionManager
    ) {
        require(_oracleImplementation != address(0), "Invalid implementation address");
        require(_permissionManagerImplementation != address(0), "Invalid permission manager implementation address");
        require(_globalPermissionManager != address(0), "Invalid global permission manager address");
        oracleImplementation = _oracleImplementation;
        permissionManagerImplementation = _permissionManagerImplementation;
        globalPermissionManager = _globalPermissionManager;
        _transferOwnership(msg.sender);
    }

    function registerCarBrand(
        string memory brandName,
        string memory priceFeedAddress,
        ICarOracle.OracleConfig memory config,
        address brandOwner
    ) external override whenNotPaused nonReentrant returns (address oracleAddress, address) {
        // Check if caller is owner or has permission
        require(
            msg.sender == owner() || globalPermissionManager.hasPermission(msg.sender, REGISTER_CAR_BRAND_SELECTOR),
            "Permission denied: registerCarBrand"
        );

        require(bytes(brandName).length > 0, "Brand name cannot be empty");
        require(bytes(priceFeedAddress).length > 0, "Price feed address cannot be empty");
        require(brandOwner != address(0), "Brand owner cannot be zero address");
        require(!_carBrands[brandName].isActive, "Brand already registered");

        // Validate configuration
        _validateOracleConfig(config);

        // Create new oracle clone
        oracleAddress =
            OracleCloneLib.createOracleClone(oracleImplementation, brandName, priceFeedAddress, config, address(this));

        // Create new permission manager clone
        //oracle address
     address clonedPermission =    permissionManagerImplementation.clone();
        address permissionManagerAddress = OracleCloneLib.createOracleClone(
          clonedPermission , brandName, priceFeedAddress, config, address(this)
        );

        // Initialize the permission manager
        IBrandPermissionManager(permissionManagerAddress).initialize(brandName, address(this), brandOwner);

        // Register the brand
        _carBrands[brandName] = CarBrand({
            name: brandName,
            oracleAddress: oracleAddress,
            priceFeedAddress: priceFeedAddress,
            lastUpdateTime: block.timestamp,
            isActive: false,
            totalProducts: 0
        });

        _brandNames.push(brandName);
        _oracleToBrand[oracleAddress] = brandName;
        _permissionManagerToBrand[permissionManagerAddress] = brandName;

        emit CarBrandRegistered(brandName, oracleAddress, priceFeedAddress, block.timestamp);
        emit BrandPermissionManagerCreated(brandName, permissionManagerAddress, brandOwner);

        return (oracleAddress, permissionManagerAddress);
    }

    function updateOracle(string memory brandName, ICarOracle.OracleConfig memory config)
        external
        override
        whenNotPaused
    {
        // Check if caller is owner or has permission
        require(
            msg.sender == owner() || globalPermissionManager.hasPermission(msg.sender, UPDATE_ORACLE_SELECTOR),
            "Permission denied: updateOracle"
        );

        require(_carBrands[brandName].isActive, "Brand not registered or inactive");

        // Validate configuration
        _validateOracleConfig(config);

        address oracleAddress = _carBrands[brandName].oracleAddress;
        ICarOracle(oracleAddress).updateConfig(config);

        _carBrands[brandName].lastUpdateTime = block.timestamp;

        emit OracleUpdated(brandName, oracleAddress, block.timestamp, block.timestamp);
    }

    function deactivateOracle(string memory brandName) external override {
        // Check if caller is owner or has permission
        require(
            msg.sender == owner() || globalPermissionManager.hasPermission(msg.sender, DEACTIVATE_ORACLE_SELECTOR),
            "Permission denied: deactivateOracle"
        );

        require(_carBrands[brandName].isActive, "Brand already inactive");

        _carBrands[brandName].isActive = false;
        address oracleAddress = _carBrands[brandName].oracleAddress;

        emit OracleDeactivated(brandName, oracleAddress, block.timestamp);
    }

    function reactivateOracle(string memory brandName) external {
        // Check if caller is owner or has permission
        require(
            msg.sender == owner() || globalPermissionManager.hasPermission(msg.sender, REACTIVATE_ORACLE_SELECTOR),
            "Permission denied: reactivateOracle"
        );

        require(!_carBrands[brandName].isActive, "Brand already active");
        require(bytes(_carBrands[brandName].name).length > 0, "Brand not found");

        _carBrands[brandName].isActive = true;
        _carBrands[brandName].lastUpdateTime = block.timestamp;

        emit OracleUpdated(brandName, _carBrands[brandName].oracleAddress, block.timestamp, block.timestamp);
    }

    function getCarBrand(string memory brandName) external view override returns (CarBrand memory) {
        return _carBrands[brandName];
    }

    function getAllCarBrands() external view override returns (string[] memory) {
        return _brandNames;
    }

    function getOracleAddress(string memory brandName) external view override returns (address) {
        return _carBrands[brandName].oracleAddress;
    }

    // function getPermissionManagerAddress(string memory brandName) external view returns (address) {
    //     // This would need to be stored in the CarBrand struct or a separate mapping
    //     // For now, we'll need to iterate through brands to find the permission manager
    //     // In a production system, you'd want to store this directly
    //     return address(0); // Placeholder
    // }

    function isOracleActive(string memory brandName) external view override returns (bool) {
        return _carBrands[brandName].isActive;
    }

    function getLastUpdateTime(string memory brandName) external view override returns (uint256) {
        return _carBrands[brandName].lastUpdateTime;
    }

    // Additional utility functions
    function getBrandByOracle(address oracleAddress) external view returns (string memory) {
        return _oracleToBrand[oracleAddress];
    }

    function getBrandByPermissionManager(address permissionManager) external view returns (string memory) {
        return _permissionManagerToBrand[permissionManager];
    }

    function getActiveBrands() external view returns (string[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < _brandNames.length; i++) {
            if (_carBrands[_brandNames[i]].isActive) {
                activeCount++;
            }
        }

        string[] memory activeBrands = new string[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < _brandNames.length; i++) {
            if (_carBrands[_brandNames[i]].isActive) {
                activeBrands[index] = _brandNames[i];
                index++;
            }
        }

        return activeBrands;
    }

    function getStaleOracles() external view returns (string[] memory) {
        uint256 staleCount = 0;
        for (uint256 i = 0; i < _brandNames.length; i++) {
            if (_carBrands[_brandNames[i]].isActive && ICarOracle(_carBrands[_brandNames[i]].oracleAddress).isStale()) {
                staleCount++;
            }
        }

        string[] memory staleOracles = new string[](staleCount);
        uint256 index = 0;
        for (uint256 i = 0; i < _brandNames.length; i++) {
            if (_carBrands[_brandNames[i]].isActive && ICarOracle(_carBrands[_brandNames[i]].oracleAddress).isStale()) {
                staleOracles[index] = _brandNames[i];
                index++;
            }
        }

        return staleOracles;
    }

    function updateOracleImplementation(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "Invalid implementation address");
        address oldImplementation = oracleImplementation;
        oracleImplementation = newImplementation;

        emit OracleImplementationUpdated(oldImplementation, newImplementation);
    }

    function updatePermissionManagerImplementation(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "Invalid implementation address");
        address oldImplementation = permissionManagerImplementation;
        permissionManagerImplementation = newImplementation;

        emit PermissionManagerImplementationUpdated(oldImplementation, newImplementation);
    }

    function updateGlobalPermissionManager(address newGlobalPermissionManager) external onlyOwner {
        require(newGlobalPermissionManager != address(0), "Invalid global permission manager address");
        address oldManager = globalPermissionManager;
        globalPermissionManager = newGlobalPermissionManager;

        emit GlobalPermissionManagerUpdated(oldManager, newGlobalPermissionManager);
    }

    function updateConfiguration(
        uint256 _minUpdateInterval,
        uint256 _maxUpdateInterval,
        uint256 _minDeviationThreshold,
        uint256 _maxDeviationThreshold
    ) external onlyOwner {
        require(_minUpdateInterval < _maxUpdateInterval, "Invalid update interval range");
        require(_minDeviationThreshold < _maxDeviationThreshold, "Invalid deviation threshold range");

        minUpdateInterval = _minUpdateInterval;
        maxUpdateInterval = _maxUpdateInterval;
        minDeviationThreshold = _minDeviationThreshold;
        maxDeviationThreshold = _maxDeviationThreshold;

        emit ConfigurationUpdated(
            _minUpdateInterval, _maxUpdateInterval, _minDeviationThreshold, _maxDeviationThreshold
        );
    }

    function incrementProductCount(string memory brandName) external {
        // Check if caller is owner or has permission
        require(
            msg.sender == owner() || globalPermissionManager.hasPermission(msg.sender, INCREMENT_PRODUCT_COUNT_SELECTOR),
            "Permission denied: incrementProductCount"
        );

        require(_carBrands[brandName].isActive, "Brand not active");
        _carBrands[brandName].totalProducts++;
    }

    function decrementProductCount(string memory brandName) external {
        // Check if caller is owner or has permission
        require(
            msg.sender == owner() || globalPermissionManager.hasPermission(msg.sender, DECREMENT_PRODUCT_COUNT_SELECTOR),
            "Permission denied: decrementProductCount"
        );

        require(_carBrands[brandName].isActive, "Brand not active");
        require(_carBrands[brandName].totalProducts > 0, "No products to decrement");
        _carBrands[brandName].totalProducts--;
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Batch operations
    function batchUpdatePrices(string[] memory brandNames, uint256[] memory prices) external {
        // Check if caller is owner or has permission
        require(
            msg.sender == owner() || globalPermissionManager.hasPermission(msg.sender, BATCH_UPDATE_PRICES_SELECTOR),
            "Permission denied: batchUpdatePrices"
        );

        require(brandNames.length == prices.length, "Arrays length mismatch");

        for (uint256 i = 0; i < brandNames.length; i++) {
            if (_carBrands[brandNames[i]].isActive) {
                ICarOracle(_carBrands[brandNames[i]].oracleAddress).updatePrice(prices[i]);
                _carBrands[brandNames[i]].lastUpdateTime = block.timestamp;
            }
        }
    }

    function getOracleStats()
        external
        view
        returns (uint256 totalBrands, uint256 activeBrands, uint256 totalProducts)
    {
        totalBrands = _brandNames.length;
        uint256 active = 0;
        uint256 products = 0;

        for (uint256 i = 0; i < _brandNames.length; i++) {
            if (_carBrands[_brandNames[i]].isActive) {
                active++;
                products += _carBrands[_brandNames[i]].totalProducts;
            }
        }

        return (totalBrands, active, products);
    }

    // Permission management helpers
    function checkPermission(address account, bytes4 functionSelector) external view returns (bool) {
        return globalPermissionManager.hasPermission(account, functionSelector);
    }

    function getPermissionDetails(address account, bytes4 functionSelector)
        external
        view
        returns (IPermissionManager.Permission memory)
    {
        return globalPermissionManager.getPermission(account, functionSelector);
    }

    // Brand-specific permission management
    // function checkBrandPermission(
    //     string memory brandName,
    //     address account,
    //     bytes4 functionSelector
    // ) external view returns (bool) {
    //     // This would need to get the brand's permission manager and check there
    //     // For now, return false as placeholder
    //     return false;
    // }

    // Internal functions
    function _validateOracleConfig(ICarOracle.OracleConfig memory config) internal view {
        require(
            config.updateInterval >= minUpdateInterval && config.updateInterval <= maxUpdateInterval,
            "Update interval out of bounds"
        );
        require(
            config.deviationThreshold >= minDeviationThreshold && config.deviationThreshold <= maxDeviationThreshold,
            "Deviation threshold out of bounds"
        );
        require(config.heartbeat > 0, "Heartbeat must be greater than 0");
        require(config.minAnswer < config.maxAnswer, "Min answer must be less than max answer");
    }
}
