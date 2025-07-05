// TODO: Replace with real backend token fetching logic
export function useBackendTokens() {
  // For now, return a static list for demo purposes
  return {
    isFetching: false,
    data: [
      {
        address: "0x0000000000000000000000000000000000000000",
        chainId: 1,
        symbol: "ETH",
        decimals: 18,
        token: {
          [1]: {
            address: "0x0000000000000000000000000000000000000000",
            chainId: 1,
            symbol: "ETH",
            decimals: 18,
          },
        },
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        chainId: 137,
        symbol: "MATIC",
        decimals: 18,
        token: {
          [137]: {
            address: "0x0000000000000000000000000000000000000000",
            chainId: 137,
            symbol: "MATIC",
            decimals: 18,
          },
        },
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        chainId: 42161,
        symbol: "ETH",
        decimals: 18,
        token: {
          [42161]: {
            address: "0x0000000000000000000000000000000000000000",
            chainId: 42161,
            symbol: "ETH",
            decimals: 18,
          },
        },
      },
    ],
  };
} 