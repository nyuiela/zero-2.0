import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getEulerSubgraphUrl, EULER_GRAPHQL_QUERIES } from '@/lib/euler-protocol-config';

export interface EulerVault {
  id: string;
  vaultName: string;
  asset: string;
  totalAssets: string;
  totalBorrows: string;
  supplyAPY: string;
  borrowAPY: string;
  supplyCap: string;
  borrowCap: string;
  interestRateModel: string;
  collateralLTVInfo: {
    collateral: string;
    borrowLTV: string;
    liquidationLTV: string;
  }[];
}

export interface EulerEarnVault {
  id: string;
  name: string;
  symbol: string;
  asset: string;
  totalAssets: string;
  totalShares: string;
  strategies: {
    id: string;
    strategy: string;
    allocationPoints: string;
    allocated: string;
  }[];
}

export function useEulerVaults(chainId: number = 1) {
  const [vaults, setVaults] = useState<EulerVault[]>([]);
  const [earnVaults, setEarnVaults] = useState<EulerEarnVault[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const subgraphUrl = getEulerSubgraphUrl(chainId);

  const fetchVaults = async () => {
    if (!subgraphUrl) {
      setError('Subgraph URL not found for this network');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch regular vaults
      const vaultsResponse = await fetch(subgraphUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: EULER_GRAPHQL_QUERIES.vaults
        })
      });

      if (!vaultsResponse.ok) {
        throw new Error(`HTTP error! status: ${vaultsResponse.status}`);
      }

      const vaultsData = await vaultsResponse.json();
      
      if (vaultsData.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(vaultsData.errors)}`);
      }

      setVaults(vaultsData.data?.vaults || []);

      // Fetch earn vaults
      const earnVaultsResponse = await fetch(subgraphUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: EULER_GRAPHQL_QUERIES.earnVaults
        })
      });

      if (earnVaultsResponse.ok) {
        const earnVaultsData = await earnVaultsResponse.json();
        if (!earnVaultsData.errors) {
          setEarnVaults(earnVaultsData.data?.earnVaults || []);
        }
      }

    } catch (err) {
      console.error('Error fetching Euler vaults:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vaults');
      
      // Fallback to mock data for development
      setVaults([
        {
          id: '0x1234567890abcdef',
          vaultName: 'USDC Vault',
          asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          totalAssets: '1000000000000',
          totalBorrows: '500000000000',
          supplyAPY: '5.2',
          borrowAPY: '7.8',
          supplyCap: '10000000000000',
          borrowCap: '8000000000000',
          interestRateModel: '0x1234567890abcdef',
          collateralLTVInfo: [
            {
              collateral: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
              borrowLTV: '80',
              liquidationLTV: '85'
            }
          ]
        },
        {
          id: '0xabcdef1234567890',
          vaultName: 'ETH Vault',
          asset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          totalAssets: '5000000000000000000000',
          totalBorrows: '2000000000000000000000',
          supplyAPY: '3.8',
          borrowAPY: '6.2',
          supplyCap: '10000000000000000000000',
          borrowCap: '8000000000000000000000',
          interestRateModel: '0xabcdef1234567890',
          collateralLTVInfo: [
            {
              collateral: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
              borrowLTV: '75',
              liquidationLTV: '80'
            }
          ]
        }
      ]);

      setEarnVaults([
        {
          id: '0xearn1234567890abcdef',
          name: 'Euler Earn USDC',
          symbol: 'eUSDC',
          asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          totalAssets: '500000000000',
          totalShares: '480000000000',
          strategies: [
            {
              id: '0xstrategy1',
              strategy: '0x1234567890abcdef',
              allocationPoints: '5000',
              allocated: '250000000000'
            },
            {
              id: '0xstrategy2',
              strategy: '0xabcdef1234567890',
              allocationPoints: '3000',
              allocated: '150000000000'
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountPositions = async (accountAddress: string) => {
    if (!subgraphUrl || !accountAddress) return null;

    try {
      const response = await fetch(subgraphUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: EULER_GRAPHQL_QUERIES.accountPositions,
          variables: { address: accountAddress.toLowerCase() }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data?.trackingActiveAccount;
    } catch (err) {
      console.error('Error fetching account positions:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchVaults();
  }, [chainId]);

  return {
    vaults,
    earnVaults,
    loading,
    error,
    refetch: fetchVaults,
    fetchAccountPositions
  };
} 