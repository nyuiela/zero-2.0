// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Treasury} from "../Euler/Treasury.sol";
import {IEVC, IEthereumVaultConnector} from "../Interface/Eular/IEVC.sol";
import {IEVault} from "../Interface/Eular/IEVault.sol";
import {IEulerSwap} from "../Interface/Eular/IEulerSwap.sol";
import {IEulerRouter} from "../Interface/Eular/IEulerRouter.sol";
import {IZeroNFT} from "../Interface/IZeronft.sol";

abstract contract EularLib is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 internal _requestIdCounter;
    address public treasury;
    address public owner;
    address public immutable zeroNFT;
    address __eulerVault;
    IEthereumVaultConnector public immutable evc;
    IEulerSwap public immutable eulerSwap;
    IEulerRouter public immutable eulerRouter;

    // Mapping to store requests
    mapping(uint256 => RequestConfig) public requests;
    mapping(uint256 => uint256) public requestIdToNFTId; // NFT ID to Request ID mapping

    // =========================
    // Vault Management
    // =========================
    mapping(address => address[]) public tokenToVaults; // Multiple vaults per token
    mapping(address => mapping(address => bool)) public vaultAuthorized; // token => vault => authorized
    mapping(address => address) public tokenToBestVault; // Best vault for each token
    mapping(address => VaultInfo) public vaultInfo; // vault => info

    struct VaultInfo {
        uint256 totalLiquidity;
        uint256 borrowRate;
        uint256 utilizationRate;
        bool isActive;
        uint256 lastUpdateTime;
    }

    // Events
    event RequestMade(
        uint256 indexed requestId,
        address indexed requesterUser,
        address requestedToken,
        uint256 requestedAmount,
        uint256 ZeroNFTID,
        uint256 requestTime,
        uint256 repayPeriod
    );

    event RequestPicked(
        uint256 indexed requestId,
        address indexed requestFulfiller,
        uint256 fulfillTime,
        uint256 collateralAmount
    );

    event EulerBorrowExecuted(
        uint256 indexed requestId,
        address indexed user,
        uint256 borrowAmount,
        address borrowToken,
        uint256 collateralDeposited
    );

    event UserRepayment(
        uint256 indexed requestId,
        address indexed user,
        uint256 repaidAmount,
        uint256 eulerRepaidAmount,
        uint256 remainingDebt
    );

    event FulfillerLiquidation(
        uint256 indexed requestId,
        address indexed fulfiller,
        uint256 liquidatedAmount,
        uint256 nftClaimed
    );

    event NFTUnlocked(
        uint256 indexed requestId,
        uint256 indexed nftId,
        address indexed user
    );

    // Vault management events
    event VaultAdded(address indexed token, address indexed vault);
    event VaultRemoved(address indexed token, address indexed vault);
    event BestVaultUpdated(address indexed token, address indexed vault);
    event VaultInfoUpdated(
        address indexed vault,
        uint256 liquidity,
        uint256 borrowRate
    );

    // Enum for request status
    enum RequestStatus {
        Pending,
        Approved,
        Borrowed,
        AwaitingRepay,
        Repaid,
        Liquidated
    }

    struct RequestConfig {
        address requesterUser;
        address requestedToken;
        uint256 requestedAmount;
        uint256 ZeroNFTID;
        uint256 requestTime;
        RequestStatus status;
        address requestFulfiller;
        uint256 repayPeriod;
        address borrowToken;
        uint256 borrowAmount;
        uint256 borrowTime;
        uint256 eulerDebtAmount;
        uint256 eulerCollateralAmount;
        address eulerVault;
    }

    constructor(
        address payable _evc,
        /* address _eulerSwap,*/
        address _eulerRouter,
        address _zeroNFT
    ) {
        evc = IEthereumVaultConnector(_evc);
        /* eulerSwap = IEulerSwap(_eulerSwap);*/
        eulerRouter = IEulerRouter(_eulerRouter);
        zeroNFT = _zeroNFT;
        owner = msg.sender;
    }

    modifier onlyOwner() virtual {
        require(msg.sender == owner, "EularLib: not owner");
        _;
    }

    modifier onlyFulfiller(uint256 requestId) {
        require(
            requests[requestId].requestFulfiller == msg.sender,
            "EularLib: not fulfiller"
        );
        _;
    }

    modifier onlyRequester(uint256 requestId) {
        require(
            requests[requestId].requesterUser == msg.sender,
            "EularLib: not requester"
        );
        _;
    }

    /**
     * @dev Request collateral using ZeroNFT as collateral
     * @param _requestedToken Token to be provided as collateral
     * @param _requestedAmount Amount of collateral needed
     * @param _ZeroNFTID ID of the ZeroNFT to use as collateral
     * @param _repayPeriod Repayment period in seconds
     * @param _borrowAmount Amount to borrow from Euler
     * @param _borrowToken Token to borrow from Euler
     */
    function requestCollateral(
        address _requestedToken,
        uint256 _requestedAmount,
        uint256 _ZeroNFTID,
        uint256 _repayPeriod,
        uint256 _borrowAmount,
        address _borrowToken
    ) public nonReentrant returns (uint256 requestId) {
        // Verify NFT ownership
        require(
            IZeroNFT(zeroNFT).isOwner(_ZeroNFTID, msg.sender),
            "EularLib: not NFT owner"
        );

        // Check if NFT is already locked using the NFT contract's locking mechanism
        require(
            !IZeroNFT(zeroNFT).isTokenLocked(_ZeroNFTID),
            "EularLib: NFT already locked"
        );

        // Validate parameters
        require(_requestedAmount > 0, "EularLib: invalid amount");
        require(_repayPeriod > 0, "EularLib: invalid repay period");
        require(_borrowAmount > 0, "EularLib: invalid borrow amount");

        requestId = _requestIdCounter++;

        requests[requestId] = RequestConfig({
            requesterUser: msg.sender,
            requestedToken: _requestedToken,
            requestedAmount: _requestedAmount,
            ZeroNFTID: _ZeroNFTID,
            requestTime: block.timestamp,
            status: RequestStatus.Pending,
            requestFulfiller: address(0),
            repayPeriod: _repayPeriod,
            borrowToken: _borrowToken,
            borrowAmount: _borrowAmount,
            borrowTime: 0,
            eulerDebtAmount: 0,
            eulerCollateralAmount: 0,
            eulerVault: address(0)
        });

        requestIdToNFTId[_ZeroNFTID] = requestId;

        emit RequestMade(
            requestId,
            msg.sender,
            _requestedToken,
            _requestedAmount,
            _ZeroNFTID,
            block.timestamp,
            _repayPeriod
        );
    }

    /**
     * @dev Fulfiller picks a request and provides collateral
     * @param _requestId ID of the request to fulfill
     */
    function pickRequest(uint256 _requestId) external nonReentrant {
        RequestConfig storage request = requests[_requestId];

        require(
            request.status == RequestStatus.Pending,
            "EularLib: request not pending"
        );
        require(
            request.requesterUser != msg.sender,
            "EularLib: cannot fulfill own request"
        );

        request.status = RequestStatus.Approved;
        request.requestFulfiller = msg.sender;

        // Transfer collateral from fulfiller to treasury
        IERC20(request.requestedToken).safeTransferFrom(
            msg.sender,
            treasury,
            request.requestedAmount
        );

        // Lock the NFT using the NFT contract's locking mechanism
        IZeroNFT(zeroNFT).setTokenLock(request.ZeroNFTID, true);

        emit RequestPicked(
            _requestId,
            msg.sender,
            block.timestamp,
            request.requestedAmount
        );
    }

    /**
     * @dev Execute borrowing from Euler protocol using the provided collateral
     * @param _requestId ID of the request
     * @param _eulerVault Address of the Euler vault to use
     */

    function borrowFromEular(
        uint256 _requestId
    ) public nonReentrant onlyRequester(_requestId) {
        RequestConfig storage request = requests[_requestId];

        require(
            request.status == RequestStatus.Approved,
            "EularLib: request not approved"
        );
        require(_eulerVault != address(0), "EularLib: invalid vault address");

        request.status = RequestStatus.Borrowed;
        request.borrowTime = block.timestamp;
        request.eulerVault = _eulerVault;
        request.eulerCollateralAmount = request.requestedAmount;
        request.eulerDebtAmount = request.borrowAmount;

        // Transfer collateral from treasury to this contract
        IERC20(request.requestedToken).safeTransferFrom(
            treasury,
            address(this),
            request.requestedAmount
        );

        // Deposit collateral to Euler vault
        IEVault vault = IEVault(_eulerVault);
        IERC20(request.requestedToken).approve(
            _eulerVault,
            request.requestedAmount
        );
        vault.deposit(request.requestedAmount, address(this));

        // Borrow from Euler vault
        vault.borrow(request.borrowAmount, request.requesterUser);

        emit EulerBorrowExecuted(
            _requestId,
            request.requesterUser,
            request.borrowAmount,
            request.borrowToken,
            request.requestedAmount
        );
    }

    /**
     * @dev User repays the fulfiller and handles Euler debt
     * @param _requestId ID of the request
     */
    function repayToFulfiller(
        uint256 _requestId
    ) external payable nonReentrant onlyRequester(_requestId) {
        RequestConfig storage request = requests[_requestId];

        require(
            request.status == RequestStatus.Borrowed,
            "EularLib: request not borrowed"
        );
        require(
            block.timestamp <= request.borrowTime + request.repayPeriod,
            "EularLib: repayment period expired"
        );

        // Calculate how much to repay to fulfiller
        uint256 fulfillerRepayAmount = request.requestedAmount;

        // Transfer repayment to fulfiller
        IERC20(request.requestedToken).safeTransferFrom(
            msg.sender,
            request.requestFulfiller,
            fulfillerRepayAmount
        );

        // Handle Euler debt repayment
        uint256 eulerRepaidAmount = _repayEulerDebt(_requestId); //@todo

        // Calculate remaining debt (if any)
        uint256 remainingDebt = request.eulerDebtAmount - eulerRepaidAmount;

        if (remainingDebt == 0) {
            // Full repayment - unlock NFT
            _unlockNFT(_requestId);
            request.status = RequestStatus.Repaid;
        } else {
            // Partial repayment - user needs to pay remaining debt
            request.eulerDebtAmount = remainingDebt;
            request.status = RequestStatus.AwaitingRepay;
        }

        emit UserRepayment(
            _requestId,
            msg.sender,
            fulfillerRepayAmount,
            eulerRepaidAmount,
            remainingDebt
        );
    }

    /**
     * @dev Fulfiller liquidates when repayment period expires
     * @param _requestId ID of the request
     */
    function liquidateByFulfiller(
        uint256 _requestId
    ) external nonReentrant onlyFulfiller(_requestId) {
        RequestConfig storage request = requests[_requestId];

        require(
            block.timestamp > request.borrowTime + request.repayPeriod,
            "EularLib: repayment period not expired"
        );
        require(
            request.status == RequestStatus.Borrowed ||
                request.status == RequestStatus.AwaitingRepay,
            "EularLib: cannot liquidate"
        );

        // Repay Euler debt using collateral
        uint256 eulerRepaidAmount = _repayEulerDebt(_requestId);

        // Calculate remaining collateral after Euler repayment
        uint256 remainingCollateral = request.eulerCollateralAmount -
            eulerRepaidAmount;

        // Transfer remaining collateral to fulfiller
        if (remainingCollateral > 0) {
            IERC20(request.requestedToken).safeTransfer(
                request.requestFulfiller,
                remainingCollateral
            );
        }

        // Transfer NFT to fulfiller
        IZeroNFT(zeroNFT).transferZeroFrom(
            request.requesterUser,
            request.requestFulfiller,
            request.ZeroNFTID
        );

        // Update status
        request.status = RequestStatus.Liquidated;

        emit FulfillerLiquidation(
            _requestId,
            request.requestFulfiller,
            remainingCollateral,
            request.ZeroNFTID
        );
    }

    /**
     * @dev Complete repayment of remaining Euler debt
     * @param _requestId ID of the request
     */
    function completeRepayment(
        uint256 _requestId
    ) external nonReentrant onlyRequester(_requestId) {
        RequestConfig storage request = requests[_requestId];

        require(
            request.status == RequestStatus.AwaitingRepay,
            "EularLib: not awaiting repayment"
        );
        require(request.eulerDebtAmount > 0, "EularLib: no debt to repay");

        // User pays the remaining Euler debt
        IERC20(request.borrowToken).safeTransferFrom(
            msg.sender,
            address(this),
            request.eulerDebtAmount
        );

        // Repay to Euler vault
        IEVault vault = IEVault(request.eulerVault);
        IERC20(request.borrowToken).approve(
            request.eulerVault,
            request.eulerDebtAmount
        );
        vault.repay(request.eulerDebtAmount, address(this));

        // Withdraw collateral from Euler vault
        vault.withdraw(
            request.eulerCollateralAmount,
            address(this),
            address(this)
        );

        // Unlock NFT
        _unlockNFT(_requestId);
        request.status = RequestStatus.Repaid;
        request.eulerDebtAmount = 0;

        emit UserRepayment(
            _requestId,
            msg.sender,
            0,
            request.eulerDebtAmount,
            0
        );
    }

    /**
     * @dev Internal function to repay Euler debt using collateral
     * @param _requestId ID of the request
     * @return amountRepaid Amount repaid to Euler
     */
    function _repayEulerDebt(
        uint256 _requestId
    ) internal returns (uint256 amountRepaid) {
        RequestConfig storage request = requests[_requestId];

        IEVault vault = IEVault(request.eulerVault);

        // Calculate how much we can repay with the collateral
        uint256 collateralValue = request.eulerCollateralAmount;
        uint256 debtToRepay = request.eulerDebtAmount;

        // We can only repay up to the debt amount
        amountRepaid = collateralValue > debtToRepay
            ? debtToRepay
            : collateralValue;

        if (amountRepaid > 0) {
            // Withdraw collateral from vault
            vault.withdraw(amountRepaid, address(this), address(this));

            // Repay debt to vault
            IERC20(request.borrowToken).approve(
                request.eulerVault,
                amountRepaid
            );
            vault.repay(amountRepaid, address(this));
        }

        return amountRepaid;
    }

    /**
     * @dev Internal function to unlock NFT
     * @param _requestId ID of the request
     */
    function _unlockNFT(uint256 _requestId) internal {
        RequestConfig storage request = requests[_requestId];

        // Unlock the NFT using the NFT contract's locking mechanism
        IZeroNFT(zeroNFT).setTokenLock(request.ZeroNFTID, false);

        emit NFTUnlocked(_requestId, request.ZeroNFTID, request.requesterUser);
    }

    /**
     * @dev Set treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "EularLib: invalid treasury address");
        treasury = _treasury;
    }

    /**
     * @dev Get request details
     * @param _requestId ID of the request
     */
    function getRequest(
        uint256 _requestId
    ) external view returns (RequestConfig memory) {
        require(_requestId < _requestIdCounter, "EularLib: request not found");
        return requests[_requestId];
    }

    /**
     * @dev Check if NFT is locked using the NFT contract's locking mechanism
     * @param _nftId ID of the NFT
     */
    function isNFTLocked(uint256 _nftId) external view returns (bool) {
        return IZeroNFT(zeroNFT).isTokenLocked(_nftId);
    }

    /**
     * @dev Get request ID for an NFT
     * @param _nftId ID of the NFT
     */
    function getRequestIdForNFT(
        uint256 _nftId
    ) external view returns (uint256) {
        return requestIdToNFTId[_nftId];
    }

    /**
     * @dev Check if repayment period has expired
     * @param _requestId ID of the request
     */
    function isRepaymentExpired(
        uint256 _requestId
    ) external view returns (bool) {
        RequestConfig storage request = requests[_requestId];
        return block.timestamp > request.borrowTime + request.repayPeriod;
    }

    /**
     * @dev Get remaining time until liquidation
     * @param _requestId ID of the request
     */
    function getTimeUntilLiquidation(
        uint256 _requestId
    ) external view returns (uint256) {
        RequestConfig storage request = requests[_requestId];
        if (request.borrowTime == 0) return 0;

        uint256 expirationTime = request.borrowTime + request.repayPeriod;
        if (block.timestamp >= expirationTime) return 0;

        return expirationTime - block.timestamp;
    }

    function setEvaultAddress(address __evault) public {
        __eulerVault = __evault;
    }
}
