// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

//import "contract/src/oracle/Oracle.sol";
import {ICarOracle} from "../Interface/oracle/IcarOracle.sol";
import {IOracleMaster} from "../Interface/oracle/IOracleMaster.sol";
import {StateManager} from "./State.sol";
import {Profile} from "./profile.sol";
import {InitFunction} from "../chainlink/InitFunction.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
contract CarRegistry {
  using Clones for address;

  // contracts
  Profile public profileContract;
  StateManager public stateContract;
  InitFunction public initFunction;
  address public profileAddr;
  address public stateAddr;
  address public chainFunctionAddr;
  address public ccipAddr;
  address public merkleVerifierAddr;
  address public initFunctionAddr;

  //errors
  error BrandAlreadyInRegistry(string brand);

  // structs
  enum Status {
    PENDING,
    ACTIVE,
    COMPLETED
  }
  struct Registry {
    string brand;
    Status status;
    bytes32 request;
    bytes32 response;
  }

  // event
  event BrandRegistryRequested(string brand, bytes32 requestId);

  // storage

  // constructor
  constructor(address _profileAddr, address _stateAddr, address _chainFunctionAddr, address _ccipAddr, address _merkleVerifierAddr) {
    profileAddr = _profileAddr;
    stateAddr = _stateAddr;
    profileContract = Profile(_profileAddr);
    stateContract = StateManager(_stateAddr);
    chainFunctionAddr = _chainFunctionAddr;
    ccipAddr = _ccipAddr;
    merkleVerifierAddr = _merkleVerifierAddr;
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
          registry[_brand] = Registry({
            brand: _brand,
            status: Status.PENDING,
            request: requestId,
            response: ""
          });
          emit BrandRegistryRequested(_brand, requestId);
    }

    /// new ownership rights transfer
    function registerUndernewOwner() external {
        // remove olldownership
        // give to new owner
        // add new older to the tree and register the information person
    }

    function activate(string memory _brand) external {
        
        
        stateContract.initiate(_brand);
        //init Function will initiate db and return state;
        // ccip clone
        // address _state = stateAddr.clone();
        string memory _state = "";
        address _chainFunction = chainFunctionAddr.clone();
        address _ccip = ccipAddr.clone();
        address _merkleVerifier = merkleVerifierAddr.clone();
        // merkle clone
        profileContract.create(_brand, _state, _chainFunction, _ccip, _merkleVerifier);
        registry[_brand].response = "";
        registry[_brand].status = Status.ACTIVE;
    }

    function stake() external {}

    function storeOntree() internal {}

    // only staked brands can ativate
    function isActive() public {}

    // --- register --- state -- activate
}
