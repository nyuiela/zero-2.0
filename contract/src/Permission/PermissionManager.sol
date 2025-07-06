// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";

contract PermissionManager is IPermissionManager, Ownable, Pausable {
    // Storage
    mapping(address => mapping(bytes4 => Permission)) private _permissions;
    mapping(address => bytes4[]) private _accountFunctionSelectors;
    mapping(bytes4 => address[]) private _functionAccounts;
    mapping(address => uint256) private _accountPermissionCount;

    uint256 private _totalPermissions;

    // Constants
    uint256 public constant MAX_EXPIRATION_TIME = 365 days;
    uint256 public constant MIN_EXPIRATION_TIME = 1 hours;

    // Modifiers
    modifier onlyWithPermission(bytes4 functionSelector) {
        require(
            hasPermission(msg.sender, functionSelector),
            "Permission denied"
        );
        _;
    }

    modifier validExpirationTime(uint256 expiresAt) {
        require(
            expiresAt > block.timestamp,
            "Expiration time must be in the future"
        );
        require(
            expiresAt <= block.timestamp + MAX_EXPIRATION_TIME,
            "Expiration time too far in future"
        );
        _;
    }

    modifier validAccount(address account) {
        require(account != address(0), "Invalid account address");
        _;
    }

    constructor() Ownable(msg.sender) Pausable() {
        _transferOwnership(msg.sender);
    }

    function grantPermission(
        address account,
        bytes4 functionSelector,
        uint256 expiresAt
    )
        external
        override
        onlyOwner
        validAccount(account)
        validExpirationTime(expiresAt)
        whenNotPaused
    {
        _grantPermission(account, functionSelector, expiresAt);
    }

    function grantBatchPermissions(
        address account,
        bytes4[] memory functionSelectors,
        uint256 expiresAt
    )
        external
        override
        onlyOwner
        validAccount(account)
        validExpirationTime(expiresAt)
        whenNotPaused
    {
        require(functionSelectors.length > 0, "Empty function selectors array");
        require(functionSelectors.length <= 50, "Too many function selectors");

        for (uint256 i = 0; i < functionSelectors.length; i++) {
            _grantPermission(account, functionSelectors[i], expiresAt);
        }

        emit BatchPermissionsGranted(
            account,
            functionSelectors,
            expiresAt,
            block.timestamp
        );
    }

    function revokePermission(
        address account,
        bytes4 functionSelector
    ) external override onlyOwner validAccount(account) {
        _revokePermission(account, functionSelector);
    }

    function revokeBatchPermissions(
        address account,
        bytes4[] memory functionSelectors
    ) external override onlyOwner validAccount(account) {
        require(functionSelectors.length > 0, "Empty function selectors array");
        require(functionSelectors.length <= 50, "Too many function selectors");

        for (uint256 i = 0; i < functionSelectors.length; i++) {
            _revokePermission(account, functionSelectors[i]);
        }

        emit BatchPermissionsRevoked(
            account,
            functionSelectors,
            block.timestamp
        );
    }

    function revokeAllPermissions(
        address account
    ) external override onlyOwner validAccount(account) {
        bytes4[] memory functionSelectors = _accountFunctionSelectors[account];

        for (uint256 i = 0; i < functionSelectors.length; i++) {
            if (_permissions[account][functionSelectors[i]].isActive) {
                _revokePermission(account, functionSelectors[i]);
            }
        }
    }

    function hasPermission(
        address account,
        bytes4 functionSelector
    ) public view override returns (bool) {
        Permission memory permission = _permissions[account][functionSelector];

        if (!permission.isActive) {
            return false;
        }

        if (permission.expiresAt <= block.timestamp) {
            return false;
        }

        return true;
    }

    function getPermission(
        address account,
        bytes4 functionSelector
    ) external view override returns (Permission memory) {
        return _permissions[account][functionSelector];
    }

    function getAccountPermissions(
        address account
    ) external view override returns (Permission[] memory) {
        bytes4[] memory functionSelectors = _accountFunctionSelectors[account];
        Permission[] memory permissions = new Permission[](
            functionSelectors.length
        );

        for (uint256 i = 0; i < functionSelectors.length; i++) {
            permissions[i] = _permissions[account][functionSelectors[i]];
        }

        return permissions;
    }

    function getFunctionPermissions(
        bytes4 functionSelector
    ) external view override returns (Permission[] memory) {
        address[] memory accounts = _functionAccounts[functionSelector];
        Permission[] memory permissions = new Permission[](accounts.length);

        for (uint256 i = 0; i < accounts.length; i++) {
            permissions[i] = _permissions[accounts[i]][functionSelector];
        }

        return permissions;
    }

    function isPermissionExpired(
        address account,
        bytes4 functionSelector
    ) external view override returns (bool) {
        Permission memory permission = _permissions[account][functionSelector];
        return permission.isActive && permission.expiresAt <= block.timestamp;
    }

    function getActivePermissionsCount(
        address account
    ) external view override returns (uint256) {
        return _accountPermissionCount[account];
    }

    function getTotalPermissionsCount()
        external
        view
        override
        returns (uint256)
    {
        return _totalPermissions;
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Internal functions
    function _grantPermission(
        address account,
        bytes4 functionSelector,
        uint256 expiresAt
    ) internal {
        Permission storage permission = _permissions[account][functionSelector];

        // If permission doesn't exist, add to tracking arrays
        if (!permission.isActive) {
            _accountFunctionSelectors[account].push(functionSelector);
            _functionAccounts[functionSelector].push(account);
            _accountPermissionCount[account]++;
            _totalPermissions++;
        }

        permission.account = account;
        permission.functionSelector = functionSelector;
        permission.isActive = true;
        permission.grantedAt = block.timestamp;
        permission.expiresAt = expiresAt;

        emit PermissionGranted(
            account,
            functionSelector,
            expiresAt,
            block.timestamp
        );
    }

    function _revokePermission(
        address account,
        bytes4 functionSelector
    ) internal {
        Permission storage permission = _permissions[account][functionSelector];

        if (permission.isActive) {
            permission.isActive = false;
            _accountPermissionCount[account]--;
            _totalPermissions--;

            emit PermissionRevoked(account, functionSelector, block.timestamp);
        }
    }

    // Utility functions
    function getAccountFunctionSelectors(
        address account
    ) external view returns (bytes4[] memory) {
        return _accountFunctionSelectors[account];
    }

    function getFunctionAccounts(
        bytes4 functionSelector
    ) external view returns (address[] memory) {
        return _functionAccounts[functionSelector];
    }

    function cleanExpiredPermissions(address account) external {
        bytes4[] memory functionSelectors = _accountFunctionSelectors[account];
        uint256 cleanedCount = 0;

        for (uint256 i = 0; i < functionSelectors.length; i++) {
            Permission storage permission = _permissions[account][
                functionSelectors[i]
            ];

            if (
                permission.isActive && permission.expiresAt <= block.timestamp
            ) {
                permission.isActive = false;
                _accountPermissionCount[account]--;
                _totalPermissions--;
                cleanedCount++;

                //      emit PermissionExpired(account, functionSelectors[i], block.timestamp);
            }
        }
    }

    function batchCleanExpiredPermissions(address[] memory accounts) external {
        for (uint256 i = 0; i < accounts.length; i++) {
            this.cleanExpiredPermissions(accounts[i]);
        }
    }

    // Admin functions
    function updateMaxExpirationTime(
        uint256 newMaxExpirationTime
    ) external view onlyOwner {
        require(
            newMaxExpirationTime > MIN_EXPIRATION_TIME,
            "Max expiration time too low"
        );
        require(
            newMaxExpirationTime <= 2 * 365 days,
            "Max expiration time too high"
        );

        // This would require adding a state variable for MAX_EXPIRATION_TIME
        // For now, we'll keep it as a constant
    }

    function getPermissionStats()
        external
        view
        returns (
            uint256 totalPermissions,
            uint256 activePermissions,
            uint256 expiredPermissions
        )
    {
        totalPermissions = _totalPermissions;
        activePermissions = 0;
        expiredPermissions = 0;

        // This would require iterating through all permissions
        // For efficiency, we could add additional tracking variables
        return (totalPermissions, activePermissions, expiredPermissions);
    }
}
