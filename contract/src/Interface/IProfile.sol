// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IProfile {
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

    event ProfileCreated(string _brand, address initiator);
    event UpdatedState(string _brand, string state);
    event ChangedRegistry(address _registry);

    function create(
        string memory _brand,
        string memory _state,
        address _chainFunction,
        address _ccip,
        address _merkleVerifier,
        address _brandP,
        address _oracle,
        address _syncer
    ) external;
    function getProfile(string memory _brand) external view returns (BrandProfile memory);
    function updateState(string memory _brand, string memory _state) external;
    function lockBrand(string memory _brand) external;
    function unlockBrand(string memory _brand) external;
    function setRegistry(address _registry) external;
}
