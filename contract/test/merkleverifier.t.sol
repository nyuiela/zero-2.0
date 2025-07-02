//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MerkleVerifier} from "../src/chainlink/merkle_verifier.sol";
import {Sync} from "src/chainlink/sync_function.sol";
import {ProofSync} from "src/chainlink/proofSync.sol";

// please stop working for a second
contract MerkleVerifierTest is Test {
    MerkleVerifier merkle;
}
