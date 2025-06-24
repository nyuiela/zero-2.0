// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IPermissionManager {
    struct Permission {
        address account;
        bytes4 functionSelector;
        bool isActive;
        uint256 grantedAt;
        uint256 expiresAt;
    }

    struct PermissionRequest {
        address account;
        bytes4 functionSelector;
        uint256 expiresAt;
    }

    event PermissionGranted(
        address indexed account,
        bytes4 indexed functionSelector,
        uint256 expiresAt,
        uint256 timestamp
    );

    event PermissionRevoked(
        address indexed account,
        bytes4 indexed functionSelector,
        uint256 timestamp
    );

    event PermissionExpired(
        address indexed account,
        bytes4 indexed functionSelector,
        uint256 timestamp
    );

    event BatchPermissionsGranted(
        address indexed account,
        bytes4[] functionSelectors,
        uint256 expiresAt,
        uint256 timestamp
    );

    event BatchPermissionsRevoked(
        address indexed account,
        bytes4[] functionSelectors,
        uint256 timestamp
    );

    function grantPermission(
        address account,
        bytes4 functionSelector,
        uint256 expiresAt
    ) external;

    function grantBatchPermissions(
        address account,
        bytes4[] memory functionSelectors,
        uint256 expiresAt
    ) external;

    function revokePermission(
        address account,
        bytes4 functionSelector
    ) external;

    function revokeBatchPermissions(
        address account,
        bytes4[] memory functionSelectors
    ) external;

    function revokeAllPermissions(address account) external;

    function hasPermission(
        address account,
        bytes4 functionSelector
    ) external view returns (bool);

    function getPermission(
        address account,
        bytes4 functionSelector
    ) external view returns (Permission memory);

    function getAccountPermissions(
        address account
    ) external view returns (Permission[] memory);

    function getFunctionPermissions(
        bytes4 functionSelector
    ) external view returns (Permission[] memory);

    function isPermissionExpired(
        address account,
        bytes4 functionSelector
    ) external view returns (bool);

    function getActivePermissionsCount(address account) external view returns (uint256);

    function getTotalPermissionsCount() external view returns (uint256);
} 