import { isRouteQuote, isRouteTransactionStep } from "../utils/guards";

import { useSelectedBridgeRoute } from "./routes/use-selected-bridge-route";
import { useChain } from "./use-chain";
import { useInjectedStore } from "../state/injected-provider";

export const useMetadata = () => {
  return useInjectedStore((s) => s.app);
};

export const useId = () => {
  return useInjectedStore((s) => s.id);
};

export const useApp = () => {
  return useInjectedStore((s) => s.app);
};

export const useHost = () => useInjectedStore((s) => s.host);
export const useIsPaid = () => useInjectedStore((s) => s.isPaid);
export const useDeletedAt = () => useInjectedStore((s) => s.deletedAt);
export const useDefaultRoute = () => useInjectedStore((s) => s.defaultRoute);
export const useSupportsOnRamp = () =>
  useInjectedStore((s) => s.supportsOnRamp);
export const useCustomToS = () => useInjectedStore((s) => s.tos);



export const useInitiatingChainId = () => {
  const route = useSelectedBridgeRoute();

  return route.data?.result &&
    isRouteQuote(route.data.result) &&
    route.data.result.steps[0] &&
    isRouteTransactionStep(route.data.result.steps[0])
    ? parseInt(route.data.result.steps[0].chainId)
    : undefined;
};

export const useInitiatingChain = () => {
  const chainId = useInitiatingChainId();
  return useChain(chainId);
};
