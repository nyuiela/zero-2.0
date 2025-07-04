import { useSwapBridgeContext } from "../providers/SwapBridgeProvider";

export const useInjectedStore = <T>(selector: (state: any) => T): T => {
  const { injectedStore } = useSwapBridgeContext();
  return injectedStore(selector);
}; 