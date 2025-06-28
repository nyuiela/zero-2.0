# Brand Registration Form

A comprehensive React form component for registering car brands with oracle configuration, designed to work with the smart contract `registerBrand` function.

## Features

- **Complete Form Validation**: Uses Zod schema validation for all inputs
- **Oracle Configuration**: Structured inputs for all oracle parameters
- **Ethereum Address Validation**: Validates brand admin addresses
- **Dynamic Arguments**: Support for variable-length argument arrays
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Built-in loading state management
- **TypeScript Support**: Fully typed with proper interfaces

## Smart Contract Mapping

The form maps directly to the `registerBrand` function parameters:

```solidity
function registerBrand(
    string memory _brand,
    ICarOracle.OracleConfig memory config,
    address brandAdminAddr,
    uint64 subscriptionId,
    string memory _stateUrl,
    string[] memory args
) external
```

### OracleConfig Structure

```solidity
struct OracleConfig {
    uint256 updateInterval;
    uint256 deviationThreshold;
    uint256 heartbeat;
    uint256 minAnswer;
    uint256 maxAnswer;
}
```

## Form Fields

### Basic Information

- **Brand Name**: The name of the car brand to register
- **State URL**: URL where brand state information is stored

### Oracle Configuration

- **Update Interval**: How often the oracle should update prices (in seconds)
- **Deviation Threshold**: Maximum allowed price deviation before triggering update (percentage)
- **Heartbeat**: Maximum time between updates before considering stale (in seconds)
- **Minimum Answer**: Minimum acceptable oracle answer value
- **Maximum Answer**: Maximum acceptable oracle answer value

### Admin & Subscription

- **Brand Admin Address**: Ethereum address of the brand administrator
- **Subscription ID**: Chainlink VRF subscription ID for random number generation

### Arguments

- **Arguments**: Additional arguments for the oracle request (comma-separated)

## Usage

### Basic Usage

```tsx
import { BrandRegistrationForm } from "@/components/brand-registration-form";

function MyComponent() {
  const handleSubmit = async (data) => {
    // Handle form submission
    console.log("Form data:", data);

    // Example contract call structure:
    const contractData = {
      _brand: data.brand,
      config: {
        updateInterval: BigInt(data.updateInterval),
        deviationThreshold: BigInt(data.deviationThreshold),
        heartbeat: BigInt(data.heartbeat),
        minAnswer: BigInt(data.minAnswer),
        maxAnswer: BigInt(data.maxAnswer),
      },
      brandAdminAddr: data.brandAdminAddr,
      subscriptionId: BigInt(data.subscriptionId),
      _stateUrl: data.stateUrl,
      args: data.args,
    };
  };

  return <BrandRegistrationForm onSubmit={handleSubmit} isLoading={false} />;
}
```

### With Demo Component

```tsx
import { BrandRegistrationDemo } from "@/components/brand-registration-demo";

function App() {
  return <BrandRegistrationDemo />;
}
```

## Props

### BrandRegistrationForm Props

| Prop        | Type                       | Description                                     |
| ----------- | -------------------------- | ----------------------------------------------- |
| `onSubmit`  | `(data: FormData) => void` | Callback function called when form is submitted |
| `isLoading` | `boolean`                  | Whether the form is in a loading state          |

### FormData Structure

```typescript
type FormData = {
  brand: string;
  updateInterval: string;
  deviationThreshold: string;
  heartbeat: string;
  minAnswer: string;
  maxAnswer: string;
  brandAdminAddr: string;
  subscriptionId: string;
  stateUrl: string;
  args: string[];
};
```

## Validation Rules

- **Brand Name**: Required, non-empty string
- **Update Interval**: Required, positive number
- **Deviation Threshold**: Required, positive number
- **Heartbeat**: Required, positive number
- **Min Answer**: Required, number
- **Max Answer**: Required, number greater than min answer
- **Brand Admin Address**: Required, valid Ethereum address (42 characters)
- **Subscription ID**: Required, positive number
- **State URL**: Required, valid URL format
- **Arguments**: Required, non-empty string (will be converted to array)

## Styling

The component uses the existing UI components from your design system:

- `Card` for the main container
- `Form` components for form handling
- `Input` for text and number inputs
- `Textarea` for multi-line input
- `Button` for actions

The form follows your existing design patterns with:

- Brand colors (`text-brand`)
- Responsive grid layout
- Proper spacing and typography
- Loading states and error handling

## Integration with Smart Contracts

To integrate with your smart contract:

1. **Connect Wallet**: Use a library like `wagmi` or `web3-react` to connect to MetaMask
2. **Contract Instance**: Create an instance of your smart contract
3. **Call Function**: Use the form data to call the `registerBrand` function
4. **Handle Response**: Wait for transaction confirmation and handle success/error states

Example integration:

```tsx
import { useContract, useProvider, useSigner } from "wagmi";

const handleSubmit = async (data) => {
  const { data: signer } = useSigner();
  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    signerOrProvider: signer,
  });

  try {
    const tx = await contract.registerBrand(
      data.brand,
      {
        updateInterval: data.updateInterval,
        deviationThreshold: data.deviationThreshold,
        heartbeat: data.heartbeat,
        minAnswer: data.minAnswer,
        maxAnswer: data.maxAnswer,
      },
      data.brandAdminAddr,
      data.subscriptionId,
      data.stateUrl,
      data.args
    );

    await tx.wait();
    console.log("Brand registered successfully!");
  } catch (error) {
    console.error("Error registering brand:", error);
  }
};
```

## Dependencies

The component requires these dependencies:

- `react-hook-form` for form state management
- `@hookform/resolvers/zod` for Zod validation
- `zod` for schema validation
- Your existing UI components (`@/components/ui/*`)

Make sure these are installed in your project:

```bash
npm install react-hook-form @hookform/resolvers zod
```
