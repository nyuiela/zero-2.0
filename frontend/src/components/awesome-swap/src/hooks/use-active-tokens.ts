import { useMemo } from "react";
import { useAllTokens } from "./use-all-tokens";
import { useInjectedStore } from "./use-injected-store";

// TODO: Replace with real utility functions
const isBridgeable = (from: any, to: any) => {
  return from && to;
};

const isBridgedUsdc = (token: any) => {
  return token?.symbol === "USDC.e";
};

const nativeUSDC: { [chainId: number]: any } = {
  1: { symbol: "USDC" },
  137: { symbol: "USDC" },
  42161: { symbol: "USDC" },
};

export function useActiveTokens() {
  const tokens = useAllTokens();
  const fromChainId = useInjectedStore((s) => s.fromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);

  const hasNativeUsdc = useMemo(
    () => !!nativeUSDC[fromChainId] && !!nativeUSDC[toChainId],
    [fromChainId, toChainId]
  );

  return useMemo(() => {
    if (tokens.isFetching) {
      return {
        isFetching: true,
        data: null,
      };
    }

    return {
      isFetching: false,
      data: tokens.data?.filter((t: any) => {
        const from = t[fromChainId];
        const to = t[toChainId];

        if (!from || !to) return false;

        /**
         * We want to disable selection of the bridged-USDC token
         * when depositing if there exists a native USDC option
         */
        if (
          fromChainId === 1 &&
          hasNativeUsdc &&
          (isBridgedUsdc(from) || isBridgedUsdc(to))
        ) {
          return false;
        }

        return isBridgeable(from, to);
      }) || [],
    };
  }, [tokens.data, tokens.isFetching, fromChainId, toChainId, hasNativeUsdc]);
} 