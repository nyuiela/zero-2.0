// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FunctionsClient} from "@chainlink/contracts/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {StateManager} from "../core/State.sol";
import{CarRegistry} from "../core/registry.sol";
// cloned
/**
 * @title Sync - auto sync state every hour.
 * @notice Checks the data and gets a proof of the state
 * @dev we will update the states and check the proof in the verifier
 */

//CheckState
contract InitFunction is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;
    CarRegistry _registryContract;

    // State variables to store the last request ID, response, and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    string public brand;

    address public stateAddress;
    StateManager public stateContract;

    mapping(string => bytes32) public request;
    mapping(bytes32 => string) private response;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);
    error StateDiffers();
    // error StateChange

    // Event to log responses
    event Response(bytes32 indexed requestId, string state, bytes response, bytes err);
    event ChangeDON(bytes32 indexed donId, address owner);
    event ChangeRouter(address indexed router, address owner);
    event ChangeGasLimit(uint256 gas, address owner);
    // Router address - Hardcoded for Sepolia

    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    // JavaScript source code
    // Fetch state name from the Star Wars API.
    // Documentation: https://swapi.info/people
    string source = "const stateId = args[0];" "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://swapi.info/api/people/${stateId}/`" "});" "if (apiResponse.error) {"
        "throw Error('Request failed');" "}" "const { data } = apiResponse;" "return Functions.encodeString(data.name);";
      // using the deployed ip address to check state 
    //Callback gas limit
    uint32 gasLimit = 300000;

    // donID - Hardcoded for Sepolia

    bytes32 donID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // State variable to store the returned state information
    string public state;

    function setDon(bytes32 _donId) public onlyOwner {
        donID = _donId;
        emit ChangeDON(_donId, msg.sender);
    }

    function setRouter(address _router) public onlyOwner {
        router = _router;
        emit ChangeRouter(_router, msg.sender);
    }

    function setGasLimit(uint32 _gas) public onlyOwner {
        gasLimit = _gas;
        emit ChangeGasLimit(_gas, msg.sender);
    }

    /**
     * @notice Initializes the contract with the Chainlink router address and sets the contract owner
     */
    constructor(address _stateAddr,address _registry) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        stateAddress = _stateAddr;

        stateContract = StateManager(_stateAddr);
        _registryContract = CarRegistry(_registry);
    }

    /**
     * @notice Sends an HTTP request for state information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param args The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     */
    function sendRequest(uint64 subscriptionId, string[] calldata args, string memory _brand)
        external
        virtual
        onlyRegistry
        returns (bytes32 requestId)
    {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);

        request[_brand] = s_lastRequestId;

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param _response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(bytes32 requestId, bytes memory _response, bytes memory err) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }
        // Update the contract's state variables with the response and any errors
        s_lastResponse = _response;
        string memory _state = string(_response);
        s_lastError = err;

        // check state
        // if state is not same: initate stake *&& lock contract.
        // if (state)
        // bytes32 s1 = keccak256(abi.encodePacked(state));
        // bytes32 s2 = keccak256(abi.encodePacked(_state));
        // if (s1 == s2) {
        //   state = string(response);
        // } else {
        //   stateContract.lockContract(brand, "State Differs");
        // }
        // Emit an event to log the response
        response[requestId] = string(_response);
        emit Response(requestId, state, s_lastResponse, s_lastError);
    }

    function getResponse(string memory _brand) public view returns (string memory) {
        bytes32 id = request[_brand];
        return response[id];
    }

    modifier onlyRegistry(){
        require(msg.sender == address(_registryContract), "Init_Function: not authorized");
        _;
    }
}
