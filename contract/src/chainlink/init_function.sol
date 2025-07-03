// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {StateManager} from "../core/State.sol";
import {CarRegistry} from "../core/registry.sol";

// cloned
/**
 * @title Sync - auto sync state every hour.
 * @notice Checks the data and gets a proof of the state
 * @dev we will update the states and check the proof in the verifier
 */
contract InitFunction is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // State variables to store the last request ID, response, and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    address registry;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);
    error StateDiffers();

    event ChangeDON(bytes32 indexed donId, address owner);
    event ChangeRouter(address indexed router, address owner);
    event ChangeGasLimit(uint256 gas, address owner);

    // Event to log responses
    event Response(
        bytes32 indexed requestId,
        string character,
        bytes response,
        bytes err
    );

    //
    modifier onlyRegistry() {
        require(msg.sender == registry, "Init_Function: not authorized");
        _;
    }

    // Router address - Hardcoded for Sepolia
    // Check to get the router address for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    address router = 0xf9B8fc078197181C841c296C876945aaa425B278;

    string source =
        "const url = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `${url}`"
        "});"
        "if (apiResponse.error) {"
        "console.error(apiResponse.error);"
        "throw Error('Sync Request failed');"
        "}"
        "const { data } = apiResponse;"
        "console.log('API response data:', JSON.stringify(data, null, 2));"
        "return Functions.encodeString(data.cid);";

    //Callback gas limit
    uint32 gasLimit = 300000;

    // donID - Hardcoded for Sepolia
    // Check to get the donID for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    bytes32 donID =
        0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;

    // State variable to store the returned character information
    string public character;
    mapping(string => bytes32) public request;
    mapping(bytes32 => string) private c_response;

    /**
     * @notice Initializes the contract with the Chainlink router address and sets the contract owner
     */
    constructor(
        address _registry
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        registry = _registry;
    }

    function setDon(bytes32 _donID) public onlyOwner {
        donID = _donID; // Set the DON ID
        emit ChangeDON(_donID, msg.sender); // Emit an event for the change
    }

    function setRouter(address _router) public onlyOwner {
        router = _router; // Set the router address
        emit ChangeRouter(_router, msg.sender); // Emit an event for the change
    }

    function setGasLimit(uint32 _gasLimit) public onlyOwner {
        gasLimit = _gasLimit; // Set the gas limit for the request
        emit ChangeGasLimit(_gasLimit, msg.sender); // Emit an event for the change
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param args The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     */
    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args,
        string memory _brand
    ) external virtual returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        request[_brand] = s_lastRequestId;

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }
        // Update the contract's state variables with the response and any errors
        s_lastResponse = response;
        c_response[requestId] = string(response);
        s_lastError = err;

        // Emit an event to log the response
        emit Response(requestId, character, s_lastResponse, s_lastError);
    }

    function getResponse(
        string memory _brand
    ) public view returns (string memory) {
        bytes32 id = request[_brand];
        return c_response[id];
    }

    function setRegistry(address newp) public onlyOwner {
        registry = newp;
    }
}
