# Auction Registration Form

A comprehensive React form component for creating auctions, designed to work with the smart contract `createAuction` function.

## Features

- **Complete Form Validation**: Uses Zod schema validation for all inputs
- **NFT Selection**: Visual NFT picker with brand auto-population
- **Smart Contract Mapping**: Direct mapping to `createAuction` function parameters
- **Date/Time Validation**: Ensures start time is in future and end time is after start time
- **Bid Validation**: Ensures threshold is greater than initial bid
- **Ethereum Address Validation**: Validates bid token addresses
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Built-in loading state management
- **TypeScript Support**: Fully typed with proper interfaces

## Smart Contract Mapping

The form maps directly to the `createAuction` function parameters:

```solidity
function createAuction(
    string memory brandName,
    uint256 startTime,
    uint256 endTime,
    uint256 initialBid,
    uint256 bidThreshold,
    address bidToken,
    uint256 nftTokenId
) external onlyActiveBrand(brandName)
```

## Form Fields

### NFT Selection

- **NFT Token ID**: The token ID of the NFT to auction
- **Brand Name**: Auto-populated when NFT is selected, or manually entered

### Auction Timing

- **Start Time**: When the auction should begin (must be in the future)
- **End Time**: When the auction should end (must be after start time)

### Bidding Parameters

- **Initial Bid**: Minimum starting bid amount in ETH
- **Bid Threshold**: Minimum bid to reach threshold (must be > initial bid)
- **Bid Token Address**: Ethereum address of the token used for bidding

## Validation Rules

### Smart Contract Requirements

- **Start Time**: Must be >= current block timestamp
- **End Time**: Must be > start time
- **Initial Bid**: Must be > 0
- **Bid Threshold**: Must be > initial bid
- **NFT Ownership**: User must own the NFT
- **Brand Match**: NFT brand must match the specified brand
- **NFT Status**: NFT must not be locked

### Form Validation

- **Brand Name**: Required, non-empty string
- **Start Time**: Required, must be in the future
- **End Time**: Required, must be after start time
- **Initial Bid**: Required, positive number
- **Bid Threshold**: Required, positive number, greater than initial bid
- **Bid Token**: Required, valid Ethereum address (42 characters)
- **NFT Token ID**: Required, valid number

## Usage

### Basic Usage

```tsx
import { AuctionRegistrationForm } from "@/components/auction-registration-form";

function MyComponent() {
  const handleSubmit = async (data) => {
    // Handle form submission
    console.log("Form data:", data);

    // Example contract call structure:
    const contractData = {
      brandName: data.brandName,
      startTime: BigInt(data.startTime),
      endTime: BigInt(data.endTime),
      initialBid: BigInt(Math.floor(parseFloat(data.initialBid) * 1e18)),
      bidThreshold: BigInt(Math.floor(parseFloat(data.bidThreshold) * 1e18)),
      bidToken: data.bidToken,
      nftTokenId: BigInt(data.nftTokenId),
    };
  };

  return (
    <AuctionRegistrationForm
      onSubmit={handleSubmit}
      isLoading={false}
      availableBrands={["Toyota", "BMW", "Mercedes"]}
      userNFTs={[
        {
          tokenId: "1",
          brandName: "Toyota",
          isLocked: false,
        },
      ]}
    />
  );
}
```

### With Demo Page

```tsx
// Navigate to /create-auction
// The page includes authentication checks and demo data
```

## Props

### AuctionRegistrationForm Props

| Prop              | Type                          | Description                                     |
| ----------------- | ----------------------------- | ----------------------------------------------- |
| `onSubmit`        | `(data: AuctionData) => void` | Callback function called when form is submitted |
| `isLoading`       | `boolean`                     | Whether the form is in a loading state          |
| `availableBrands` | `string[]`                    | Array of available brand names for selection    |
| `userNFTs`        | `UserNFT[]`                   | Array of user's NFTs for selection              |

### Data Types

```typescript
type AuctionData = {
  brandName: string;
  startTime: string; // Unix timestamp
  endTime: string; // Unix timestamp
  initialBid: string;
  bidThreshold: string;
  bidToken: string;
  nftTokenId: string;
};

type UserNFT = {
  tokenId: string;
  brandName: string;
  isLocked: boolean;
};
```

## NFT Selection Feature

The form includes a visual NFT selection interface that:

1. **Shows Available NFTs**: Only displays NFTs that are not locked
2. **Auto-populates Fields**: When an NFT is selected, it automatically fills:
   - NFT Token ID
   - Brand Name
3. **Visual Feedback**: Selected NFT is highlighted with brand colors
4. **Validation**: Ensures user owns the NFT and it's not locked

## Smart Contract Integration

To integrate with your smart contract:

1. **Connect Wallet**: Use a library like `wagmi` or `web3-react`
2. **Contract Instance**: Create an instance of your auction contract
3. **Call Function**: Use the form data to call the `createAuction` function
4. **Handle Response**: Wait for transaction confirmation

Example integration:

```tsx
import { useContract, useSigner } from "wagmi";

const handleSubmit = async (data: AuctionData) => {
  const { data: signer } = useSigner();
  const contract = useContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    signerOrProvider: signer,
  });

  try {
    const tx = await contract.createAuction(
      data.brandName,
      BigInt(data.startTime),
      BigInt(data.endTime),
      BigInt(Math.floor(parseFloat(data.initialBid) * 1e18)),
      BigInt(Math.floor(parseFloat(data.bidThreshold) * 1e18)),
      data.bidToken,
      BigInt(data.nftTokenId)
    );

    await tx.wait();
    console.log("Auction created successfully!");
  } catch (error) {
    console.error("Error creating auction:", error);
  }
};
```

## Data Conversion

The form automatically handles data conversion:

- **Dates to Timestamps**: Converts datetime-local inputs to Unix timestamps
- **ETH to Wei**: Converts ETH amounts to wei for smart contract calls
- **String to BigInt**: Converts numeric strings to BigInt for contract calls

## Error Handling

The form includes comprehensive error handling:

- **Validation Errors**: Real-time validation with helpful error messages
- **Smart Contract Errors**: Handles contract-specific error messages
- **Network Errors**: Graceful handling of network issues
- **User Feedback**: Clear success/error notifications

## Styling

The component uses your existing UI components:

- `Card` for the main container
- `Form` components for form handling
- `Input` for text and number inputs
- `Select` for dropdown selections
- `Button` for actions

The form follows your design patterns with:

- Brand colors (`text-brand`)
- Responsive grid layout
- Proper spacing and typography
- Loading states and error handling

## Dependencies

The component requires these dependencies:

- `react-hook-form` for form state management
- `@hookform/resolvers/zod` for Zod validation
- `zod` for schema validation
- Your existing UI components (`@/components/ui/*`)

Make sure these are installed:

```bash
npm install react-hook-form @hookform/resolvers zod
```

## Security Considerations

1. **NFT Ownership**: Verify user owns the NFT before allowing auction creation
2. **Brand Authorization**: Ensure user has permission to create auctions for the brand
3. **Input Validation**: Validate all inputs on both frontend and smart contract
4. **Access Control**: Use `onlyActiveBrand` modifier for brand-specific access
5. **Reentrancy Protection**: Smart contract should include reentrancy guards

## Testing

The form includes comprehensive validation testing:

```tsx
// Test cases covered:
- Valid auction creation
- Invalid start time (past)
- Invalid end time (before start)
- Invalid bid amounts
- Invalid NFT selection
- Missing required fields
- Invalid Ethereum addresses
```

## Future Enhancements

Potential improvements:

- **NFT Preview**: Show NFT metadata and images
- **Gas Estimation**: Estimate gas costs before submission
- **Batch Creation**: Support for creating multiple auctions
- **Template System**: Pre-defined auction templates
- **Advanced Scheduling**: Recurring auction schedules
