// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "../interfaces/IPermissionManager.sol";

library PermissionModifiers {
    /**
     * @dev Modifier to check if the caller has permission for a specific function
     * @param permissionManager The address of the permission manager contract
     * @param functionSelector The function selector to check permission for
     */
    modifier onlyWithPermission(address permissionManager, bytes4 functionSelector) {
        require(
            IPermissionManager(permissionManager).hasPermission(msg.sender, functionSelector),
            "Permission denied"
        );
        _;
    }

    /**
     * @dev Modifier to check if the caller has permission for multiple functions
     * @param permissionManager The address of the permission manager contract
     * @param functionSelectors Array of function selectors to check permissions for
     */
    modifier onlyWithAnyPermission(address permissionManager, bytes4[] memory functionSelectors) {
        bool hasAnyPermission = false;
        
        for (uint256 i = 0; i < functionSelectors.length; i++) {
            if (IPermissionManager(permissionManager).hasPermission(msg.sender, functionSelectors[i])) {
                hasAnyPermission = true;
                break;
            }
        }
        
        require(hasAnyPermission, "No permission for any function");
        _;
    }

    /**
     * @dev Modifier to check if the caller has permission for all specified functions
     * @param permissionManager The address of the permission manager contract
     * @param functionSelectors Array of function selectors to check permissions for
     */
    modifier onlyWithAllPermissions(address permissionManager, bytes4[] memory functionSelectors) {
        for (uint256 i = 0; i < functionSelectors.length; i++) {
            require(
                IPermissionManager(permissionManager).hasPermission(msg.sender, functionSelectors[i]),
                "Missing permission for function"
            );
        }
        _;
    }

    /**
     * @dev Function to check if an address has permission for a specific function
     * @param permissionManager The address of the permission manager contract
     * @param account The address to check permissions for
     * @param functionSelector The function selector to check permission for
     * @return True if the account has permission, false otherwise
     */
    function hasPermission(
        address permissionManager,
        address account,
        bytes4 functionSelector
    ) internal view returns (bool) {
        return IPermissionManager(permissionManager).hasPermission(account, functionSelector);
    }

    /**
     * @dev Function to check if an address has permission for any of the specified functions
     * @param permissionManager The address of the permission manager contract
     * @param account The address to check permissions for
     * @param functionSelectors Array of function selectors to check permissions for
     * @return True if the account has permission for any function, false otherwise
     */
    function hasAnyPermission(
        address permissionManager,
        address account,
        bytes4[] memory functionSelectors
    ) internal view returns (bool) {
        for (uint256 i = 0; i < functionSelectors.length; i++) {
            if (IPermissionManager(permissionManager).hasPermission(account, functionSelectors[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Function to check if an address has permission for all specified functions
     * @param permissionManager The address of the permission manager contract
     * @param account The address to check permissions for
     * @param functionSelectors Array of function selectors to check permissions for
     * @return True if the account has permission for all functions, false otherwise
     */
    function hasAllPermissions(
        address permissionManager,
        address account,
        bytes4[] memory functionSelectors
    ) internal view returns (bool) {
        for (uint256 i = 0; i < functionSelectors.length; i++) {
            if (!IPermissionManager(permissionManager).hasPermission(account, functionSelectors[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * @dev Function to get the permission details for an account and function
     * @param permissionManager The address of the permission manager contract
     * @param account The address to get permission details for
     * @param functionSelector The function selector to get permission details for
     * @return Permission struct containing the permission details
     */
    function getPermission(
        address permissionManager,
        address account,
        bytes4 functionSelector
    ) internal view returns (IPermissionManager.Permission memory) {
        return IPermissionManager(permissionManager).getPermission(account, functionSelector);
    }

    /**
     * @dev Function to check if a permission is expired
     * @param permissionManager The address of the permission manager contract
     * @param account The address to check
     * @param functionSelector The function selector to check
     * @return True if the permission is expired, false otherwise
     */
    function isPermissionExpired(
        address permissionManager,
        address account,
        bytes4 functionSelector
    ) internal view returns (bool) {
        return IPermissionManager(permissionManager).isPermissionExpired(account, functionSelector);
    }
} 