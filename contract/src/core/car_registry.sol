// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

//import "contract/src/oracle/Oracle.sol";
import {ICarOracle} from "../Interface/oracle/IcarOracle.sol";
import {IOracleMaster} from "../Interface/oracle/IOracleMaster.sol";

contract CarRegistry {
    // first timer
    //register or ownership !! protol can regisrer or general??
    // car brand --- number avaliable ?? instock
    // stake / eth or usdc(bool espression for that ) // collateral on the brand
    // merke verifier cloned

    function registercar(
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
    }

    /// new ownership rights transfer
    function registerUndernewOwner() external {
        // remove olldownership
        // give to new owner
        // add new older to the tree and register the information person
    }

    function activate() external {}

    function stake() external {}

    function storeOntree() internal {}

    // only staked brands can ativate
    function isActive() public {}

    // --- register --- state -- activate
}
