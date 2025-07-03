// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/Console2.sol";
import {BaseTest} from "./BaseTest.t.sol";
import {CCIPLocalSimulatorFork} from "@chainlink/local/src/ccip/CCIPLocalSimulatorFork.sol";
import {BurnMintERC677Helper} from "@chainlink/local/src/ccip/BurnMintERC677Helper.sol";
import {Register} from "@chainlink/local/src/ccip/Register.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";

contract CrossMessagingSync is BaseTest {
    string DESTINATION_RPC_URL = vm.envString("ETHERUM_URL");
    string SOURCE_RPC_URL = vm.envString("BASE_URL");
    uint256 destinationFork = vm.createSelectFork(DESTINATION_RPC_URL);
    uint256 sourceFork = vm.createFork(SOURCE_RPC_URL); //sourceFork =
    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    BurnMintERC677Helper destinationCCIPBnMToken;
    BurnMintERC677Helper sourceCCIPBnMToken;
    IERC20 sourceLinkToken;
    IRouterClient sourceRouter;
    uint64 destinationChainSelector;
    uint64 sourceChainSelector;

    //   address(destinationCCIPBnMToken),
    //   address(sourceCCIPBnMToken),
    //   address(sourceLinkToken),
    //   address(sourceRouter)
    //  );

    function prepareTest()
        public
        returns (Client.EVMTokenAmount[] memory tokensToSendDetails)
    {
        // This function prepares the test
        // I got this.
        vm.selectFork(sourceFork);
        vm.startPrank(alice);
        sourceCCIPBnMToken.drip(alice);

        uint256 amountToSend = 100;
        sourceCCIPBnMToken.approve(address(sourceRouter), amountToSend);

        tokensToSendDetails = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenToSendDetails = Client
            .EVMTokenAmount({
                token: address(destinationCCIPBnMToken),
                amount: amountToSend
            });
        tokensToSendDetails[0] = tokenToSendDetails;
        vm.makePersistent(address(sourceRouter));
        vm.stopPrank();
    }

    function setUp() public {
        // ccip setup
        CCIPLocalSimulatorFork ccipLocalSimulatorFork = new CCIPLocalSimulatorFork();
        vm.makePersistent(address(ccipLocalSimulatorFork));
        Register.NetworkDetails
            memory destinationNetworkDetails = ccipLocalSimulatorFork
                .getNetworkDetails(block.chainid);
        destinationCCIPBnMToken = BurnMintERC677Helper(
            destinationNetworkDetails.ccipBnMAddress
        );
        destinationChainSelector = destinationNetworkDetails.chainSelector;
        vm.selectFork(sourceFork);
        Register.NetworkDetails
            memory sourceNetworkDetails = ccipLocalSimulatorFork
                .getNetworkDetails(block.chainid);
        sourceCCIPBnMToken = BurnMintERC677Helper(
            sourceNetworkDetails.ccipBnMAddress
        );
        sourceLinkToken = IERC20(sourceNetworkDetails.linkAddress);
        sourceRouter = IRouterClient(sourceNetworkDetails.routerAddress);
        vm.makePersistent(
            address(destinationCCIPBnMToken),
            address(sourceLinkToken),
            address(sourceRouter)
        );
        vm.makePersistent(address(sourceCCIPBnMToken));
    }

    function testCCIPTransfer() public {
        // This is the test that will run the CCIP transfer
        // It will use the prepareTest function to set up the tokens to send

        Client.EVMTokenAmount[] memory am = prepareTest();
        vm.selectFork(destinationFork);
        uint256 balanceOfBobBefore = destinationCCIPBnMToken.balanceOf(bob);

        console2.log(balanceOfBobBefore);
        //   am[0].token = address(destinationCCIPBnMToken);
        //   assertEq(am[0].amount, 100, "Amount to send should be 100");
    }

    // baseSetUp() ;
}
