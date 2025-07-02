//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CarRegistry} from "../src/core/registry.sol";
import {StateManager} from "../src/core/State.sol";
import {ProofSync} from "../src/chainlink/proofSync.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {CrossToken} from "../src/chainlink/ccip.sol";
import {Profile} from "../src/core/profile.sol";
import {Reputation} from "../src/core/reputation.sol";
import {StateManager} from "../src/core/State.sol";
import {OracleMaster} from "../src/oracle/Oracle.sol";
import {CarOracle} from "../src/oracle/CarOracle.sol";
import {BrandPermissionManager} from "../src/Permission/BrandPermissionManager.sol";
import {PermissionManager} from "../src/Permission/PermissionManager.sol";
import {UsdcToken} from "./mocks/IUSDC.sol";
import {Sync} from "../src/chainlink/sync_function.sol";
import {ICarOracle} from "../src/Interface/oracle/IcarOracle.sol";
import {InitFunction} from "../src/chainlink/init_function.sol";
import {Sync} from "../src/chainlink/sync_function.sol";
import {ZeroNFT} from "../src/tokens/ZeroNFT.sol";
import {IZeroNFT} from "../src/interface/IZeronft.sol";
import {Auction} from "../src/core/auction.sol";
import {console2} from "forge-std/Console2.sol";
import {Profile} from "../src/core/profile.sol";

contract StateManagerTest is Test {
    StateManager state;
    PermissionManager permissions;
    Profile profile;
    string constant BRAND = "leeees1";
    address public lee = address(0x23);

    function setUp() public {
        permissions = new PermissionManager();
        profile = new Profile(address(permissions));
        state = new StateManager(address(profile), address(permissions));

        //give permissions
        bytes4 functionSelector = state.initiate.selector;
        uint256 time = block.timestamp + 340 days;
        permissions.grantPermission(lee, functionSelector, time);

        // initialize state
        vm.prank(lee);
        state.initiate(BRAND);
    }
}
