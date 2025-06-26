// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Profile {
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

    // called when registering brand;
    function create(
        string memory _brand,
        string memory _state,
        address _chainFunction,
        address _ccip,
        address _merkleVerifier,
        address _brandP,
        address _oracle
    ) public /* onlyOwner */ {
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
            oracle: _oracle
        });
        emit ProfileCreated(_brand, msg.sender);
    }

    function getProfile(string memory _brand) public view returns (BrandProfile memory) {
        return profile[_brand];
    }

    function updateState(string memory _brand, string memory _state) public /* only Permissioned users */ {
        // check permission or simply allow only state contract to update the state.
        profile[_brand].state = _state;
        emit UpdatedState(_brand, _state);
    }

    function lockBrand(string memory _brand) public {
        profile[_brand].locked = true;
    }

    function unlockBrand(string memory _brand) public {
        profile[_brand].locked = false;
    }
}
