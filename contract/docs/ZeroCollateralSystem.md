# Zero Collateral System Documentation

## Overview

The Zero Collateral System allows ZeroNFT holders to use their NFTs as collateral to borrow funds for flash arbitrage operations on the Euler protocol. This system creates a trustless lending mechanism where users can access capital without traditional collateral requirements.

## Architecture

### Core Components

1. **FlashArbitrageEngine**: Main contract that integrates flash arbitrage with zero collateral functionality
2. **EularLib**: Abstract contract providing zero collateral logic
3. **Treasury**: Manages collateral deposits and transfers
4. **ZeroNFT**: NFT contract representing real-world assets (cars)

### Key Features

- **NFT as Collateral**: Users lock their ZeroNFTs to access borrowing
- **Trustless Lending**: Fulfillers provide collateral and can liquidate if repayment fails
- **Euler Integration**: Borrowing and arbitrage operations on Euler protocol
- **Flexible Repayment**: Multiple repayment options with automatic liquidation

## Workflow

### 1. Request Creation

```solidity
function requestCollateral(
    address _requestedToken,    // Token needed as collateral
    uint256 _requestedAmount,   // Amount of collateral needed
    uint256 _ZeroNFTID,         // NFT ID to use as collateral
    uint256 _repayPeriod,       // Repayment period in seconds
    uint256 _borrowAmount,      // Amount to borrow from Euler
    address _borrowToken        // Token to borrow from Euler
) external returns (uint256 requestId)
```

**Steps:**
1. User verifies NFT ownership
2. System checks if NFT is already locked
3. Creates request with specified parameters
4. Locks the NFT
5. Emits `RequestMade` event

### 2. Request Fulfillment

```solidity
function pickRequest(uint256 _requestId) external
```

**Steps:**
1. Fulfiller provides the requested collateral
2. Collateral is transferred to Treasury
3. Request status changes to "Approved"
4. NFT remains locked
5. Emits `RequestPicked` event

### 3. Euler Borrowing

```solidity
function borrowFromEular(uint256 _requestId, address _eulerVault) external
```

**Steps:**
1. Collateral is transferred from Treasury to contract
2. Collateral is deposited to Euler vault
3. Borrowing is executed from Euler vault
4. Borrowed funds are sent to user
5. Emits `EulerBorrowExecuted` event

### 4. Repayment Options

#### Option A: User Repayment (On Time)

```solidity
function repayToFulfiller(uint256 _requestId) external payable
```

**Steps:**
1. User repays the fulfiller the original collateral amount
2. System attempts to repay Euler debt using deposited collateral
3. If full repayment: NFT is unlocked
4. If partial repayment: User must complete remaining debt

#### Option B: Fulfiller Liquidation (After Expiry)

```solidity
function liquidateByFulfiller(uint256 _requestId) external
```

**Steps:**
1. Repayment period has expired
2. Fulfiller repays Euler debt using collateral
3. Remaining collateral is transferred to fulfiller
4. NFT is transferred to fulfiller
5. Emits `FulfillerLiquidation` event

#### Option C: Complete Repayment

```solidity
function completeRepayment(uint256 _requestId) external
```

**Steps:**
1. User pays remaining Euler debt
2. Collateral is withdrawn from Euler vault
3. NFT is unlocked
4. Request status changes to "Repaid"

## State Management

### Request Status Flow

```
Pending → Approved → Borrowed → AwaitingRepay → Repaid
                ↓
            Liquidated
```

### NFT Locking

- NFTs are locked using the ZeroNFT contract's built-in `setTokenLock` function
- Locking prevents multiple requests with the same NFT
- NFTs are unlocked upon successful repayment or liquidation
- Lock status is verified using the NFT contract's `isTokenLocked` function

## Security Features

### Access Control

- **onlyOwner**: Administrative functions
- **onlyRequester**: Functions that only the request creator can call
- **onlyFulfiller**: Functions that only the fulfiller can call

### Reentrancy Protection

- All external functions use `nonReentrant` modifier
- Prevents reentrancy attacks during token transfers

### Validation Checks

- NFT ownership verification
- Request status validation
- Repayment period enforcement
- Collateral amount validation

## Events

### Request Events

```solidity
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
```

### Execution Events

```solidity
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
```

### Liquidation Events

```solidity
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
```

## Integration with Flash Arbitrage

### Zero NFT Flash Arbitrage

```solidity
function executeFlashArbitrageWithZeroNFT(
    address targetToken,
    uint256 targetAmount,
    uint256 initialBorrowAmount,
    uint256 _maxCycles,
    address vaultAddress,
    uint256 nftId,
    uint256 repayPeriod
) external nonReentrant
```

**Process:**
1. Creates zero collateral request
2. Waits for fulfiller to provide collateral
3. Executes borrowing from Euler
4. Performs flash arbitrage cycles
5. Manages repayment and liquidation

### Post-Fulfillment Execution

```solidity
function executeArbitrageAfterZeroCollateral(
    uint256 requestId,
    address vaultAddress
) external nonReentrant
```

**Process:**
1. Verifies request is approved
2. Executes Euler borrowing
3. Performs arbitrage cycles
4. Distributes profits to user

## Treasury Management

### Collateral Tracking

- **collateralBalances**: Total collateral per token
- **userCollateral**: User-specific collateral balances
- **transferCollateral**: Internal transfers for zero collateral system

### Emergency Functions

- **emergencyWithdraw**: Owner can rescue stuck tokens
- **withdrawETH**: Owner can withdraw ETH from contract

## Query Functions

### Request Information

```solidity
function getRequest(uint256 _requestId) external view returns (RequestConfig memory)
function getPendingZeroRequests() external view returns (uint256[] memory)
function getUserZeroRequests(address user) external view returns (uint256[] memory)
function getFulfillerZeroRequests(address fulfiller) external view returns (uint256[] memory)
```

### NFT Status

```solidity
function isNFTLocked(uint256 _nftId) external view returns (bool)
function getRequestIdForNFT(uint256 _nftId) external view returns (uint256)
```

### Time Management

```solidity
function isRepaymentExpired(uint256 _requestId) external view returns (bool)
function getTimeUntilLiquidation(uint256 _requestId) external view returns (uint256)
```

## Risk Management

### Liquidation Mechanics

1. **Automatic Liquidation**: Fulfillers can liquidate after repayment period
2. **Collateral Recovery**: Euler debt is repaid using deposited collateral
3. **NFT Transfer**: Liquidated NFTs are transferred to fulfillers
4. **Partial Recovery**: Fulfillers receive remaining collateral after debt repayment

### Interest Handling

- Euler protocol interest accumulates on borrowed amounts
- Users must pay full debt including interest for complete repayment
- Collateral may not cover full debt due to interest accumulation

## Gas Optimization

### Batch Operations

- EVC batch operations for efficient Euler interactions
- Single transaction for multiple operations
- Reduced gas costs for complex arbitrage cycles

### Storage Optimization

- Efficient mapping structures for request tracking
- Minimal storage overhead for NFT locking
- Optimized event emission for gas efficiency

## Testing

### Test Scenarios

1. **Request Creation**: Verify NFT ownership and locking
2. **Request Fulfillment**: Test collateral transfer and approval
3. **Euler Borrowing**: Validate vault interactions
4. **User Repayment**: Test on-time repayment flow
5. **Fulfiller Liquidation**: Test liquidation after expiry
6. **Complete Repayment**: Test partial repayment completion
7. **Error Handling**: Test invalid operations and edge cases

### Mock Contracts

- **MockZeroNFT**: Simulates NFT ownership and transfer
- **MockERC20**: Simulates token transfers and approvals
- **MockEulerVault**: Simulates Euler vault operations

## Deployment Considerations

### Contract Addresses

- **ZeroNFT**: Address of the ZeroNFT contract
- **Treasury**: Address of the Treasury contract
- **EVC**: Address of the Ethereum Vault Connector
- **EulerSwap**: Address of the Euler Swap contract
- **EulerRouter**: Address of the Euler Router contract

### Configuration

- **maxBorrowAmount**: Maximum borrowing limit
- **maxCycles**: Maximum arbitrage cycles
- **repayPeriod**: Default repayment period
- **gasPriceLimit**: Maximum gas price for operations

## Future Enhancements

### Potential Improvements

1. **Interest Rate Models**: Dynamic interest rates based on market conditions
2. **Collateral Valuation**: Oracle-based NFT valuation
3. **Liquidation Auctions**: Auction mechanism for liquidated NFTs
4. **Insurance Pool**: Insurance mechanism for fulfiller protection
5. **Governance**: DAO governance for system parameters

### Scalability Features

1. **Batch Processing**: Multiple requests in single transaction
2. **Layer 2 Integration**: Optimistic rollups for gas efficiency
3. **Cross-chain Support**: Multi-chain NFT collateral
4. **Automated Market Making**: AMM integration for liquidity

## Conclusion

The Zero Collateral System provides a innovative solution for NFT-backed lending in the DeFi ecosystem. By combining NFT collateral with flash arbitrage, users can access capital efficiently while maintaining the security and transparency of blockchain technology.

The system's design ensures:
- **Security**: Robust access controls and reentrancy protection
- **Efficiency**: Optimized gas usage and batch operations
- **Flexibility**: Multiple repayment and liquidation options
- **Transparency**: Comprehensive event logging and query functions
- **Scalability**: Modular design for future enhancements 