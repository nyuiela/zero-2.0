// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// import {IERC20} from "@openzepplin-con";
// import {Ownable} from "";
// import {SafeERC20} from "";
// import {IEularSwap} from "";
// import {IEularBorrow} from "";

/** Capital efficency system that leverages on Euler's core components (swaps and borrowing)
 */
// things to get
//1. Eular swap interface
//2. euler borrowing pair pool interface
// todo now --- build the core of the system and add the eular where its need when youre done with the base
contract FlashArbitriageEngine {
    address public constant ETHEREUMADDRESS = 0x03333333322222;
    address public constant USDCADDRESS = 0x033;
    uint256 nextPositionId;
    bool private _arbitrageInProgress;

    // configs
    uint256 public maxCycles = 10; // can be reset to prevent dos
    uint256 repayWindow = 24 hours; // can reconfigure

    struct FlashPositions {
        uint256 id;
        address user;
        address targetToken;
        uint256 targetAmount;
        uint256 borrowAmount;
        uint256 arbitrageProfit;
        uint256 cyclesExcuted; // so user will specigy how many cycles they want
        bool isActive;
        uint256 createdAt;
        uint256 repayBy; // add deadlines on repay to aviod the protol accumulating debt
    }

    //Eular position for the flash excution
    mapping(uint256 => FlashPositions) public positions;
    mapping(address => uint256[]) private userToPosition;

    // this is done to prvent creation of new position for the same auction id
    // mapping(address => mapping(uint256 => FlashPosition)) public userToPosition;

    modifier arbitrageGuard() {
        require(
            !_arbitrageInProgress,
            "FlashArbitriageEngine: Arbitrage in progress"
        );
        _;
    }

    address euler;
    address _eulerSwap;

    constructor(address _euler, address _eulerSwap) {
        // euler = IErulerBorrow(_euler);
        // _eulerSwap = IEularSwap(_eulerSwap);
    }

    /////// flash arbitarge excution

    function executeFlashArbitrage(
        address _targetToken,
        uint256 _targetAmount,
        address initialBorrowAmount,
        uint256 _maxCycles
    ) external arbitrageGuard {
        require(
            _targetAmount > 0,
            "FlashArbitrageEngine: Target cannot be zero"
        );
        require(
            _maxCycles <= maxCycles,
            "FlashArbitrageEngine: cannot be greater than max"
        );
        FlashPositions memory position = FlashPositions({
            id: nextPositionId++,
            user: msg.sender,
            targetToken: _targetToken,
            targetAmount: _targetAmount,
            borrowAmount: 0,
            arbitrageProfit: 0,
            cyclesExcuted: 0,
            isActive: true,
            createdAt: block.timestamp,
            repayBy: block.timestamp + repayWindow
        });

        positions[nextPositionId] = position;
        userToPosition[msg.sender].push(nextPositionId);
    }
    // heyyyy, should I redeploy? I need to verify the contracts, just asking because I will be using the contacts for the graph:
    //importing and export data

    // i will add to functionlities to the auctions for the eular so , unless we redeploy the uctions so i guess is okay to deploy, i will comment everything out
}
