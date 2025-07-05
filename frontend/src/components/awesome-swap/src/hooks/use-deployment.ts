import { useMemo } from "react";

import { useInjectedStore } from "../state/injected-provider";

import { useIsSuperbridge } from "../overlays/use-is-hyperlane";
import { useAllChains } from "./use-chains";


export const useAllDeployments = () => {
    return useInjectedStore((store) => store.deployments);
  };


export const useDeployments = () => {
  const allDeployments = useAllDeployments();
  const testnets = useInjectedStore((store) => store.superbridgeTestnets);
  const isSuperbridge = useIsSuperbridge();
  const allChains = useAllChains();

  return useMemo(() => {
    if (isSuperbridge) {
      if (testnets) {
        return allDeployments.filter(
          ({ l2ChainId }) => allChains.find((x) => x.id === l2ChainId)?.testnet
        );
      } else {
        return allDeployments.filter(
          ({ l2ChainId }) => !allChains.find((x) => x.id === l2ChainId)?.testnet
        );
      }
    }
    return allDeployments;
  }, [allDeployments, testnets]);
};
