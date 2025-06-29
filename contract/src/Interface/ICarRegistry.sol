// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import {ICarOracle} from "./oracle/IcarOracle.sol";

interface ICarRegistry {
    enum Status {
        NOT_INITIATIED,
        PENDING,
        STAKED,
        ACTIVE
    }

    struct Registry {
        string brand;
        Status status;
        bytes32 request;
        string response;
        string stateUrl;
        ICarOracle.OracleConfig config;
        address brandAdminAddr;
        address owner;
    }

    event BrandRegistryRequested(string brand, bytes32 requestId);
    event BrandStaked(string brand, address staker);
    event BrandActivated(string brand, string state);
    event ChangedProfile(address newp);
    event ChangedState(address newp);
    event ChangedChainFunction(address newp);
    event ChangedReputation(address newp);
    event ChangedInitFunction(address newp);
    event ChangedCCIP(address newp);

    function registerBrand(
        string memory _brand,
        ICarOracle.OracleConfig memory config,
        address brandAdminAddr,
        uint64 subscriptionId,
        string memory _stateUrl,
        string[] memory args
    ) external;

    function registerUndernewOwner() external;

    function activate(string memory _brand) external;

    function isActivate(string memory brandName) external view returns (bool);

    function stake(string memory _brand) external payable;

    function setProfile(address _newp) external;

    function setState(address _newp) external;
}
