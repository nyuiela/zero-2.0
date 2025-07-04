import { useMemo } from "react";

import { ChainDto } from "../types";
import { useInjectedStore } from "./use-injected-store";

export const useAllChains = () => {
  const injectedChains = useInjectedStore((s) => s.chains);

  return useMemo(() => {
    const cache: { [chainId: number]: ChainDto } = {};

    for (const chain of injectedChains) {
      cache[chain.id] = chain;
    }

    return Object.values(cache);
  }, [injectedChains]);
};

export const useChains = () => {
  const allChains = useAllChains();
  const isSuperbridge = useInjectedStore((s) => s.id === "superbridge");
  const superbridgeTestnetsEnabled = useInjectedStore(
    (s) => s.superbridgeTestnets
  );

  return useMemo(() => {
    if (isSuperbridge) {
      if (superbridgeTestnetsEnabled) return allChains.filter((c) => c.testnet);
      else return allChains.filter((c) => !c.testnet);
    }
    return allChains;
  }, [allChains, superbridgeTestnetsEnabled, isSuperbridge]);
}; 