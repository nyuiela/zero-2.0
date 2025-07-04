// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import{ISwapper} from "../interface/Eular/ISwapper.sol";
//import{IEVault} from "../interface/Eular/IEuler.sol";

// ///// need the interface for the swap pool and the lending pool we will be using
// // import {IEularSwap} from "";
// // import {IEularBorrow} from "";

// /** Capital efficiency system that leverages on Euler's core components (swaps and borrowing)
//  */
// contract FlashArbitriageEngine {
//     using SafeERC20 for IERC20;

//     // will have users transfer eth and we wrapp to WETH
//     address public constant ETHEREUMADDRESS = 0x03333333322222;
//     address public constant USDCADDRESS = 0x033;
//     uint256 nextPositionId;
//     bool private _arbitrageInProgress;

//     uint256 public maxCycles = 10;
//     uint256 public _maxBorrowAmount = 1000000;
//     uint256 repayWindow = 24 hours;

//     struct FlashPositions {
//         uint256 id;
//         address user;
//         address targetToken;
//         uint256 targetAmount;
//         uint256 borrowAmount;
//         uint256 arbitrageProfit;
//         uint256 cyclesExcuted;
//         bool isActive;
//         uint256 createdAt;
//         uint256 repayBy;
//     }

//     mapping(uint256 => FlashPositions) public positions;
//     mapping(address => uint256[]) private userToPosition;

//     modifier arbitrageGuard() {
//         require(
//             !_arbitrageInProgress,
//             "FlashArbitriageEngine: Arbitrage in progress"
//         );
//         _;
//     }

//     address public euler;
//     address public eulerSwap;

//     constructor(address _euler, address _eulerSwap) {
//         euler = _euler;
//         eulerSwap = _eulerSwap;
//     }

//     event FlashArbitragePositionCreated(
//         uint256 _positionId,
//         address _user,
//         address _targetToken,
//         uint256 _targetAmount
//     );
//     event ArbitrageCycleExcuted(
//         uint256 _positionId,
//         uint256 cycle,
//         uint256 gains
//     );
//     event TargetReached(uint256 position, address _user, uint256 _targetAmount);
//     error TargetNotReached();

//     function executeFlashArbitrage(
//         address _targetToken, // USDc // ETH
//         uint256 _targetAmount,
//         uint256 initialBorrowAmount,
//         uint256 _maxCycles
//     ) external arbitrageGuard {
//         require(
//             _targetAmount > 0,
//             "FlashArbitrageEngine: Target cannot be zero"
//         );
//         require(
//             _maxCycles <= maxCycles,
//             "FlashArbitrageEngine: cannot be greater than max"
//         );

//         uint256 positionId = nextPositionId++;
//         FlashPositions memory position = FlashPositions({
//             id: positionId,
//             user: msg.sender,
//             targetToken: _targetToken,
//             targetAmount: _targetAmount,
//             borrowAmount: 0,
//             arbitrageProfit: 0,
//             cyclesExcuted: 0,
//             isActive: true,
//             createdAt: block.timestamp,
//             repayBy: block.timestamp + repayWindow
//         });

//         positions[positionId] = position;
//         userToPosition[msg.sender].push(positionId);

//         emit FlashArbitragePositionCreated(
//             position.id,
//             position.user,
//             position.targetToken,
//             position.targetAmount
//         );

//         _arbitrageInProgress = true;

//         uint256 currentBal = 0;
//         uint256 borrowed = 0;

//         for (uint256 cycle = 0; cycle < _maxCycles; cycle++) {
//             currentBal = IERC20(_targetToken).balanceOf(address(this));
//             if (currentBal >= _targetAmount) {
//                 break;
//             }

//             uint256 amountStillNeeded = _targetAmount - currentBal;
//             uint256 borrowAmount = cycle == 0
//                 ? initialBorrowAmount
//                 : (amountStillNeeded * 2);

//             if (borrowAmount > _maxBorrowAmount - borrowed) {
//                 borrowAmount = _maxBorrowAmount - borrowed;
//             }
//             if (borrowAmount == 0) break;

//             // euler.enterMarket();
//             // euler.borrow();

//             borrowed += borrowAmount;

//             uint256 profit = _executeArbitrageCycle(_targetToken, borrowAmount);

//             positions[positionId].borrowAmount = borrowed;
//             positions[positionId].arbitrageProfit += profit;
//             positions[positionId].cyclesExcuted = cycle + 1;

//             emit ArbitrageCycleExcuted(positionId, cycle + 1, profit);

//             // euler.repay();
//             borrowed -= borrowAmount;

//             currentBal = IERC20(_targetToken).balanceOf(address(this));

//             if (currentBal >= _targetAmount) {
//                 IERC20(_targetToken).transfer(msg.sender, _targetAmount);
//                 positions[positionId].targetAmount = _targetAmount;
//                 emit TargetReached(positionId, msg.sender, _targetAmount);
//                 _arbitrageInProgress = false;
//                 return;
//             }
//         }

//         _arbitrageInProgress = false;
//         revert TargetNotReached();
//     }

//     function _executeArbitrageCycle(
//         address _targetToken,
//         uint256 borrowAmount
//     ) internal returns (uint256 _profit) {
//         uint256 initialBalance = IERC20(_targetToken).balanceOf(address(this));

//         if (_targetToken == USDCADDRESS) {
//             IERC20(ETHEREUMADDRESS).approve(eulerSwap, borrowAmount);

//             uint256 usdcAmount = IEularSwap(eulerSwap).swapExactInputSingle(
//                 ETHEREUMADDRESS,
//                 USDCADDRESS,
//                 borrowAmount,
//                 0,
//                 address(this)
//             );

//             IERC20(USDCADDRESS).approve(eulerSwap, usdcAmount);

//             uint256 finalWeth = IEularSwap(eulerSwap).swapExactInputSingle(
//                 USDCADDRESS,
//                 ETHEREUMADDRESS,
//                 usdcAmount,
//                 0,
//                 address(this)
//             );

//             _profit = finalWeth > borrowAmount ? finalWeth - borrowAmount : 0;
//         } else {
//             IERC20(USDCADDRESS).approve(eulerSwap, borrowAmount);

//             uint256 wethAmount = IEularSwap(eulerSwap).swapExactInputSingle(
//                 USDCADDRESS,
//                 ETHEREUMADDRESS,
//                 borrowAmount,
//                 0,
//                 address(this)
//             );

//             IERC20(ETHEREUMADDRESS).approve(eulerSwap, wethAmount);

//             uint256 finalUsdc = IEularSwap(eulerSwap).swapExactInputSingle(
//                 ETHEREUMADDRESS,
//                 USDCADDRESS,
//                 wethAmount,
//                 0,
//                 address(this)
//             );

//             _profit = finalUsdc > borrowAmount ? finalUsdc - borrowAmount : 0;
//         }

//         return _profit;
//     }
// }
