// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

//import "contract/src/oracle/Oracle.sol";
import {ICarOracle} from "../Interface/oracle/IcarOracle.sol";
import {IOracleMaster} from "../Interface/oracle/IOracleMaster.sol";
import {StateManager} from "./State.sol";
import {Profile} from "./profile.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
contract CarRegistry {
  using Clones for address;

  // contracts
  Profile public profileContract;
  StateManager public stateContract;
  address public profileAddr;
  address public stateAddr;
  address public chainFunctionAddr;
  address public ccipAddr;
  address public merkleVerifierAddr;


  // structs

  // event

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
    function registerBrand(
        string memory _brand,
        address oracleAddre,
        ICarOracle.OracleConfig memory config,
        address brandAdminAddr
    ) external {
        IOracleMaster oracleMaster = IOracleMaster(oracleAddre);
        //  oracleMaster.registerCarBrand(_brand,oracleAddre,config, brandAdminAddr);

        //   bytes ownershipright = keccak256(msg.send, proofhoash, sign akdd);
        //  merk.storfroffg(owneshipt);
        // provide what??
        // proof of ownership
        // clone 
          //- 


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
    }

    function stake() external {}

    function storeOntree() internal {}

    // only staked brands can ativate
    function isActive() public {}

    // --- register --- state -- activate
}
