// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Test, console} from "forge-std/Test.sol";
import {BaseTest} from "./BaseTest.t.sol";
import {CCIPLocalSimulatorFork} from "@chainlink/local/src/ccip/CCIPLocalSimulatorFork.sol";
import {BurnMintERC677Helper} from "@chainlink/local/src/ccip/BurnMintERC677Helper.sol";
import {Register} from "@chainlink/local/src/ccip/Register.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";

contract CrossMessagingSync is Test {
    string DESTINATION_RPC_URL = vm.envString("ETHERUM_URL");
    string SOURCE_RPC_URL = vm.envString("BASE_URL");
    uint256 destinationFork;
    uint256 sourceFork;
    CCIPLocalSimulatorFork ccipLocalSimulatorFork;
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
        returns (
            Client.EVMTokenAmount[] memory tokensToSendDetails,
            uint256 amountToSend
        )
    {
        // This function prepares the test
        // I got this.
        vm.selectFork(sourceFork);
        //   sourceCCIPBnMToken.mint(alice, 1000 ether);
        vm.startPrank(alice);
        sourceCCIPBnMToken.drip(alice);

        amountToSend = 10;
        sourceCCIPBnMToken.approve(address(sourceRouter), amountToSend);

        tokensToSendDetails = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenToSendDetails = Client
            .EVMTokenAmount({
                token: address(sourceCCIPBnMToken),
                amount: amountToSend
            });
        tokensToSendDetails[0] = tokenToSendDetails;
        vm.makePersistent(address(sourceRouter));
        vm.stopPrank();
    }

    function setUp() public {
        // ccip setup
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(address(this), 100 ether);
        ccipLocalSimulatorFork = new CCIPLocalSimulatorFork();
        vm.makePersistent(address(ccipLocalSimulatorFork));
        destinationFork = vm.createSelectFork(DESTINATION_RPC_URL);
        sourceFork = vm.createFork(SOURCE_RPC_URL); //sourceFork =
        Register.NetworkDetails
            memory destinationNetworkDetails = ccipLocalSimulatorFork
                .getNetworkDetails(block.chainid);
        destinationCCIPBnMToken = BurnMintERC677Helper(
            destinationNetworkDetails.ccipBnMAddress
        );
        vm.makePersistent(address(destinationCCIPBnMToken));
        destinationChainSelector = destinationNetworkDetails.chainSelector;
        //   vm.makePersistent(destinationChainSelector);
        vm.selectFork(sourceFork);
        Register.NetworkDetails
            memory sourceNetworkDetails = ccipLocalSimulatorFork
                .getNetworkDetails(block.chainid);

        sourceCCIPBnMToken = BurnMintERC677Helper(
            sourceNetworkDetails.ccipBnMAddress
        );
        vm.makePersistent(address(sourceCCIPBnMToken));
        sourceLinkToken = IERC20(sourceNetworkDetails.linkAddress);
        vm.makePersistent(address(sourceLinkToken));
        sourceRouter = IRouterClient(sourceNetworkDetails.routerAddress);
        //   vm.makePersistent(
        //       address(destinationCCIPBnMToken),
        //       address(sourceLinkToken),
        //       address(sourceRouter)
        //   );
        //   vm.makePersistent(address(sourceCCIPBnMToken));
    }

    function testCCIPTransfer() public {
        // This is the test that will run the CCIP transfer
        // It will use the prepareTest function to set up the tokens to send

        (
            Client.EVMTokenAmount[] memory am,
            uint256 amountToSend
        ) = prepareTest();
        vm.selectFork(destinationFork);
        uint256 balanceOfBobBefore = destinationCCIPBnMToken.balanceOf(bob);

        vm.selectFork(sourceFork);
        vm.startPrank(alice);
        uint256 balanceOfAliceBefore = sourceCCIPBnMToken.balanceOf(alice);

        ccipLocalSimulatorFork.requestLinkFromFaucet(alice, 100 ether);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(bob),
            data: abi.encode(""),
            tokenAmounts: am,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 0})
            ),
            feeToken: address(sourceLinkToken)
        });
        uint256 fees = sourceRouter.getFee(destinationChainSelector, message);
        sourceLinkToken.approve(address(sourceRouter), fees + amountToSend);
        sourceRouter.ccipSend(destinationChainSelector, message);
        uint256 balanceOfAliceAfter = sourceCCIPBnMToken.balanceOf(alice);
        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);

        ccipLocalSimulatorFork.switchChainAndRouteMessage(destinationFork);
        uint256 balanceOfBobAfter = destinationCCIPBnMToken.balanceOf(bob);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);

        console.log("Balance of Bob before send: ", balanceOfBobBefore);
        console.log("Balance of Bob before send: ", balanceOfAliceBefore);
        vm.stopPrank();
        //   am[0].token = address(destinationCCIPBnMToken);
        //   assertEq(am[0].amount, 100, "Amount to send should be 100");
    }

    // baseSetUp() ;
}
