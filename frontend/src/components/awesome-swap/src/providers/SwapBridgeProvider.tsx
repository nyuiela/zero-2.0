import React, { ReactNode, createContext, useContext } from "react";
import { InjectedState, createInjectedStore } from "../state/injected-store";

interface SwapBridgeContextValue {
  injectedStore: ReturnType<typeof createInjectedStore>;
}

const SwapBridgeContext = createContext<SwapBridgeContextValue | null>(null);

interface SwapBridgeProviderProps {
  children: ReactNode;
  injectedState: InjectedState;
}

export const SwapBridgeProvider: React.FC<SwapBridgeProviderProps> = ({
  children,
  injectedState,
}) => {
  const injectedStore = createInjectedStore(injectedState);

  return (
    <SwapBridgeContext.Provider value={{ injectedStore }}>
      {children}
    </SwapBridgeContext.Provider>
  );
};

export const useSwapBridgeContext = () => {
  const context = useContext(SwapBridgeContext);
  if (!context) {
    throw new Error(
      "useSwapBridgeContext must be used within a SwapBridgeProvider"
    );
  }
  return context;
}; 