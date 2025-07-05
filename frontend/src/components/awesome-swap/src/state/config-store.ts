import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { MultiChainToken, RouteProvider } from "../types";

interface ConfigState {
  fiatOnramp: boolean;
  setFiatOnramp: (x: boolean) => void;

  forceViaL1: boolean;
  toggleForceViaL1: () => void;
  setForceViaL1: (b: boolean) => void;

  easyMode: boolean;
  toggleEasyMode: () => void;
  setEasyMode: (b: boolean) => void;

  token: MultiChainToken | null;
  setToken: (token: MultiChainToken) => void;

  rawAmount: string;
  setRawAmount: (raw: string) => void;

  recipientAddress: string;
  setRecipientAddress: (r: string) => void;

  displayTransactions: boolean;
  setDisplayTransactions: (b: boolean) => void;

  displayTokenNetworkSelector: boolean;
  setDisplayTokenNetworkSelector: (x: boolean) => void;

  displayTokenSelector: boolean;
  setDisplayTokenSelector: (x: boolean) => void;

  displayFiatNetworkSelector: boolean;
  setDisplayFiatNetworkSelector: (x: boolean) => void;

  networkSelectorDirection: "from" | "to";
  setNetworkSelectorDirection: (x: "from" | "to") => void;

  routeId: RouteProvider | null;
  setRouteId: (n: RouteProvider | null) => void;

  walletDrawer: boolean;
  setWalletDrawer: (b: boolean) => void;
}

const ConfigState = create<ConfigState>()((set, get) => ({
  fiatOnramp: false,
  setFiatOnramp: (fiatOnramp) => set({ fiatOnramp }),

  forceViaL1: false,
  toggleForceViaL1: () => set((s) => ({ forceViaL1: !s.forceViaL1 })),
  setForceViaL1: (forceViaL1) => set({ forceViaL1 }),

  easyMode: false,
  toggleEasyMode: () => set((s) => ({ easyMode: !s.easyMode })),
  setEasyMode: (easyMode) => set({ easyMode }),

  token: null,
  setToken: (token) => set({ token }),

  rawAmount: "",
  setRawAmount: (rawAmount) => set({ rawAmount }),

  recipientAddress: "",
  setRecipientAddress: (recipientAddress) => set({ recipientAddress }),

  displayTransactions: false,
  setDisplayTransactions: (displayTransactions) => set({ displayTransactions }),

  displayTokenNetworkSelector: false,
  setDisplayTokenNetworkSelector: (displayTokenNetworkSelector) =>
    set({ displayTokenNetworkSelector }),

  displayTokenSelector: false,
  setDisplayTokenSelector: (displayTokenSelector) =>
    set({ displayTokenSelector }),

  displayFiatNetworkSelector: false,
  setDisplayFiatNetworkSelector: (displayFiatNetworkSelector) =>
    set({ displayFiatNetworkSelector }),

  networkSelectorDirection: "from",
  setNetworkSelectorDirection: (networkSelectorDirection) =>
    set({ networkSelectorDirection }),

  routeId: null,
  setRouteId: (routeId) => set({ routeId }),

  walletDrawer: false,
  setWalletDrawer: (walletDrawer) => set({ walletDrawer }),
}));

export const useConfigState = createSelectorHooks(ConfigState); 