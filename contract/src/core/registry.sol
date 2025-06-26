// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

//import "contract/src/oracle/Oracle.sol";
import {ICarOracle} from "../Interface/oracle/IcarOracle.sol";
import {IOracleMaster} from "../Interface/oracle/IOracleMaster.sol";
import {StateManager} from "./State.sol";
import {Profile} from "./profile.sol";
import {InitFunction} from "../chainlink/Init_function.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Reputation} from "./reputation.sol";
import {MerkleVerifier} from "../chainlink/merkle_verifier.sol";
import {CarOracle} from "../oracle/CarOracle.sol";
import {BrandPermissionManager} from "../permission/BrandPermissionManager.sol";

contract CarRegistry is Ownable {
    using Clones for address;

    // contracts
    Profile public profileContract;
    StateManager public stateContract;
    InitFunction public initFunction;
    Reputation public reputation;
    address public profileAddr;
    address public stateAddr;
    address public chainFunctionAddr;
    address public ccipAddr;
    address public merkleVerifierAddr;
    address public initFunctionAddr;
    address public reputationAddr;
    address public brandPermission;
    address public permissionManager;
    address public oracle;

    //errors
    error BrandAlreadyInRegistry(string brand);
    error StatusNotStaked(string brand);
    // structs

    enum Status {
        NOT_INITIATIED,
        PENDING,
        STAKED,
        ACTIVE
    }
    // COMPLETED

    struct Registry {
        string brand;
        Status status;
        bytes32 request;
        string response;
        string stateUrl;
    }

    // event
    event BrandRegistryRequested(string brand, bytes32 requestId);
    event BrandStaked(string brand, address staker);
    event BrandActivated(string brand, string state);
    event ChangedProfile(address newp);
    event ChangedState(address newp);
    event ChangedChainFunction(address newp);
    event ChangedReputation(address newp);
    event ChangedInitFunction(address newp);
    event ChangedCCIP(address newp);

    // storage

    // constructor
    constructor(
        address _profileAddr,
        address _stateAddr,
        address _chainFunctionAddr,
        address _ccipAddr,
        address _merkleVerifierAddr,
        address payable _reputationAddr
    ) {
        profileAddr = _profileAddr;
        stateAddr = _stateAddr;
        profileContract = Profile(_profileAddr);
        stateContract = StateManager(_stateAddr);
        reputation = Reputation(_reputationAddr);
        chainFunctionAddr = _chainFunctionAddr;
        ccipAddr = _ccipAddr;
        merkleVerifierAddr = _merkleVerifierAddr;
        reputationAddr = _reputationAddr;
    }
    // first timer
    //register or ownership !! protol can regisrer or general??
    // car brand --- number avaliable ?? instock
    // stake / eth or usdc(bool espression for that ) // collateral on the brand
    // merke verifier cloned

    mapping(string => Registry) public registry;

    function registerBrand(
        string memory _brand,
        address oracleAddre,
        ICarOracle.OracleConfig memory config,
        address brandAdminAddr,
        uint64 subscriptionId,
        string memory _stateUrl,
        string[] memory args
    ) external {
        IOracleMaster oracleMaster = IOracleMaster(oracleAddre);
        bytes32 s_brand = keccak256(abi.encodePacked(_brand));
        bytes32 i_brand = keccak256(abi.encodePacked(registry[_brand].brand));
        require(s_brand != i_brand, BrandAlreadyInRegistry(_brand));
        //  oracleMaster.registerCarBrand(_brand,oracleAddre,config, brandAdminAddr);

        //   bytes ownershipright = keccak256(msg.send, proofhoash, sign akdd);
        //  merk.storfroffg(owneshipt);
        // provide what??
        // proof of ownership
        // clone
        //-
        bytes32 requestId = initFunction.sendRequest(subscriptionId, args, _brand);
        registry[_brand] =
            Registry({brand: _brand, status: Status.PENDING, request: requestId, response: "", stateUrl: _stateUrl});
        emit BrandRegistryRequested(_brand, requestId);
    }

    /// new ownership rights transfer
    function registerUndernewOwner() external {
        // remove olldownership
        // give to new owner
        // add new older to the tree and register the information person
    }

    function activate(string memory _brand) external {
        require(registry[_brand].status == Status.STAKED, StatusNotStaked(_brand));
        stateContract.initiate(_brand);
        //init Function will initiate db and return state;
        // ccip clone
        // address _state = stateAddr.clone();
        string memory _state = initFunction.getResponse(_brand);
        address _chainFunction = chainFunctionAddr.clone();
        address _ccip = ccipAddr.clone();
        address _merkleVerifier = merkleVerifierAddr.clone();
        address _brandPermission = brandPermission.clone();
        address _oracle = oracle.clone();
        // CarOracle(_oracle).initialize();
        BrandPermissionManager(_brandPermission).initialize(_brand, oracle, msg.sender);
        MerkleVerifier(_merkleVerifier).initialize(_brand, _state); // replace with Interface;
        profileContract.create(_brand, _state, _chainFunction, _ccip, _merkleVerifier, _brandPermission, _oracle);
        registry[_brand].response = _state;
        registry[_brand].status = Status.ACTIVE;
        emit BrandActivated(_brand, _state);
    }

    // move this to reputation - for better payment ways.
    function stake(string memory _brand) external payable {
        // CHANGE STATUS TO STAKED
        reputation.stake(_brand, true);
        registry[_brand].status == Status.STAKED;
        emit BrandStaked(_brand, msg.sender);
    }

    function setProfile(address _newp) public onlyOwner {
        profileAddr = _newp;
        profileContract = Profile(_newp);
        emit ChangedProfile(_newp);
    }

    function setState(address _newp) public onlyOwner {
        stateAddr = _newp;
        stateContract = StateManager(_newp);
        emit ChangedState(_newp);
    }

    function setCCIP(address _newp) public onlyOwner {
        ccipAddr = _newp;
        // ccipContract = Profile(_newp);
        emit ChangedCCIP(_newp);
    }

    function setInitFunction(address _newp) public onlyOwner {
        initFunctionAddr = _newp;
        initFunction = InitFunction(_newp);
        emit ChangedInitFunction(_newp);
    }

    function setReputatioin(address payable _newp) public onlyOwner {
        reputationAddr = _newp;
        reputation = Reputation(_newp);
        emit ChangedReputation(_newp);
    }

    function setChainFunction(address _newp) public onlyOwner {
        chainFunctionAddr = _newp;

        emit ChangedChainFunction(_newp);
    }
    // --- register --- state -- activate
}
