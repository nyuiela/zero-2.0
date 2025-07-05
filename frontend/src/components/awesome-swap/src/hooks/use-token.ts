import { useConfigState } from "../state/config-store";
import { isAddressEqual } from "../utils/is-address-equal";
import { useActiveTokens } from "./use-active-tokens";
import { useFromChain, useToChain } from "./use-chain";

// TODO: Replace with real utility
const isEth = (token: any) => {
  return token?.symbol === "ETH" || token?.symbol === "MATIC" || token?.symbol === "AVAX";
};

export const useMultichainToken = () => {
  const tokens = useActiveTokens();
  const token = useConfigState.useToken();
  const to = useToChain();
  const from = useFromChain();

  if (!token) {
    return (
      tokens.data?.find(
        (x: any) => isEth(x[from?.id ?? 0]) || isEth(x[to?.id ?? 0])
      ) ||
      tokens.data?.[0] ||
      null
    );
  }

  const fullMatch = tokens.data?.find((x: any) => {
    const potentialFrom = x[from?.id ?? 0]?.address;
    const potentialTo = x[to?.id ?? 0]?.address;

    const selectedFrom = token?.[from?.id ?? 0]?.address;
    const selectedTo = token?.[to?.id ?? 0]?.address;

    // full match
    if (
      selectedFrom &&
      selectedTo &&
      potentialFrom &&
      potentialTo &&
      isAddressEqual(from, `0x${potentialFrom}`, from, `0x${selectedFrom}`) &&
      isAddressEqual(to, `0x${potentialTo}`, to, `0x${selectedTo}`)
    ) {
      return x;
    }
  });

  if (fullMatch) {
    return fullMatch;
  }

  const partialMatch = tokens.data?.find((x: any) => {
    const potentialFrom = x[from?.id ?? 0]?.address;
    const potentialTo = x[to?.id ?? 0]?.address;

    const selectedFrom = token?.[from?.id ?? 0]?.address;
    const selectedTo = token?.[to?.id ?? 0]?.address;

    // partial match, like in the case of switching USDC -> USDC.e
    if (
      selectedFrom &&
      potentialFrom &&
      selectedTo &&
      potentialTo &&
      isAddressEqual(from, `0x${potentialFrom}`, from, `0x${selectedFrom}`)
    ) {
      return x;
    }
  });

  if (partialMatch) {
    return partialMatch;
  }

  return tokens.data?.[0] ?? null;
};

export const useSelectedToken = () => {
  const token = useMultichainToken();
  const from = useFromChain();

  if (!token) {
    return null;
  }

  return token?.[from?.id ?? 0] ?? null;
};

export const useDestinationToken = () => {
  const token = useMultichainToken();
  const to = useToChain();

  return token?.[to?.id ?? 0] ?? null;
}; 