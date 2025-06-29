// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PermissionModifiers} from "../libs/PermissionModifier.sol";
import {IPermissionManager} from "../Interface/Permissions/IPermissionManager.sol";
import {ICarRegistry} from "../Interface/ICarRegistry.sol";

contract Profile {
    ICarRegistry registryContract;

    using PermissionModifiers for address;

    address public permissionManagerImplementation;
    address public globalPermissionManager;
    address owner;
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
        string url; // this is the url of the state contract check
    }
    // error

    error BrandNotFound(string _brand);

    // event
    event ProfileCreated(string _brand, address initiator);
    event UpdatedState(string _brand, string state);
    event ChangedRegistry(address newRegistry);
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

    modifier onlyOwner() {
        require(msg.sender == owner, "Profile: not owner");
        _;
    }
    // called when registering brand;

    constructor(address _globalPermissionManager) {
        owner = msg.sender;
        // registryContract = ICarRegistry(_registry);
        globalPermissionManager = _globalPermissionManager;
    }

    function create(
        string memory _brand,
        string memory _state,
        address _chainFunction,
        address _ccip,
        address _merkleVerifier,
        address _brandP,
        address _oracle,
        address _syncer,
        string memory _url
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
            syncer: _syncer,
            url: _url
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

    function setRegistry(address _registry) public onlyOwner {
        registryContract = ICarRegistry(_registry);
        emit ChangedRegistry(_registry);
    }
}
