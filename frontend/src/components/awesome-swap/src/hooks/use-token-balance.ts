import { isAddressEqual } from "../utils/is-address-equal";
import { useActiveTokens } from "./use-active-tokens";
import { useChains } from "./use-chains";

// TODO: Replace with real token type
interface BridgeableTokenDto {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
}

export function useTokenBalance(token: BridgeableTokenDto | null) {
  const tokenBalances = useActiveTokens();
  const chains = useChains();

  if (!token) {
    return {
      isLoading: false,
      data: 0,
    };
  }

  if (tokenBalances.isLoading) {
    return {
      isLoading: true,
      data: 0,
    };
  }

  return {
    isLoading: false,
    data:
      tokenBalances.data?.find((x: any) => {
        const chain = chains.find((c: any) => c.id === token.chainId);
        if (!chain) return 0;

        return (
          x.token[token.chainId]?.address &&
          isAddressEqual(
            chain,
            x.token[token.chainId]!.address,
            chain,
            token.address
          )
        );
      })?.balance ?? 0,
  };
} 