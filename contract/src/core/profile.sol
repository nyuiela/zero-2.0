// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {PermissionModifiers} from "../libs/PermissionModifier.sol";
import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";
import {CarRegistry} from "../core/registry.sol";

contract Profile {
    CarRegistry registryContract;

    using PermissionModifiers for address;

    address public permissionManagerImplementation;
    address public globalPermissionManager;

    // structs
    struct BrandProfile {
        string brand;
        uint256 lastUpdated;
        string state;
        address chainFunction;
        address ccip;
        address merkleVerifier;
        bool locked;
        address brandPermission;
        address oracle;
        address syncer;
    }
    // error

    error BrandNotFound(string _brand);

    // event
    event ProfileCreated(string _brand, address initiator);
    event UpdatedState(string _brand, string state);
    // storage

    mapping(string => BrandProfile) public profile;
    // BrandProfile[] public profile;
    //
    bytes4 public constant UNLOCKBRAND = bytes4(keccak256("unlockBrand(string)"));
    bytes4 public constant LOCKBRAND = bytes4(keccak256("lockBrand(string)"));
    bytes4 public constant UPDATESTATE = bytes4(keccak256("updateState(string, string)"));

    modifier onlyRegistry() {
        require(msg.sender == address(registryContract), "Profile: not authorized");
        _;
    }
    // called when registering brand;

    function create(
        string memory _brand,
        string memory _state,
        address _chainFunction,
        address _ccip,
        address _merkleVerifier,
        address _brandP,
        address _oracle,
        address _syncer
    ) public onlyRegistry {
        // require()

        profile[_brand] = BrandProfile({
            brand: _brand,
            lastUpdated: block.timestamp,
            state: _state,
            chainFunction: _chainFunction,
            ccip: _ccip,
            merkleVerifier: _merkleVerifier,
            locked: false,
            brandPermission: _brandP,
            oracle: _oracle,
            syncer: _syncer
        });
        emit ProfileCreated(_brand, msg.sender);
    }

    function getProfile(string memory _brand) public view returns (BrandProfile memory) {
        return profile[_brand];
    }

    function updateState(string memory _brand, string memory _state) public /* only Permissioned users */ {
        require(globalPermissionManager.hasPermission(msg.sender, UPDATESTATE), "profile: Unauthorized");
        // check permission or simply allow only state contract to update the state.
        profile[_brand].state = _state;
        emit UpdatedState(_brand, _state);
    }

    function lockBrand(string memory _brand) public {
        require(globalPermissionManager.hasPermission(msg.sender, LOCKBRAND), "profile: Unauthorized");
        profile[_brand].locked = true;
    }

    function unlockBrand(string memory _brand) public {
        require(globalPermissionManager.hasPermission(msg.sender, UNLOCKBRAND), "profile: Unauthorized");
        profile[_brand].locked = false;
    }

    constructor(address _registry, address _globalPermissionManager) {
        registryContract = CarRegistry(_registry);
        globalPermissionManager = _globalPermissionManager;
    }
}
