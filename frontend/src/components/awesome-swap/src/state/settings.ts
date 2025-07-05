import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Address, isAddressEqual } from "viem";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MultiChainToken } from "../types";

export interface CustomTokenList {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

interface SettingsState {
  preferredExplorer: string;
  setPreferredExplorer: (x: string) => void;

  currency: string;
  setCurrency: (x: string) => void;

  customTokenLists: CustomTokenList[];
  setCustomTokenLists: (list: CustomTokenList[]) => void;

  hasViewedTos: boolean;
  dismissTos: () => void;

  setCustomTokens: (t: MultiChainToken[]) => void;
  customTokens: MultiChainToken[];

  slippage: number;
  setSlippage: (slippage: number) => void;

  recentChainIds: number[];
  addRecentChainId: (id: number) => void;

  rejectedCallsUpdate: Address[];
  addRejectedCallsUpdate: (addr: Address) => void;
}

const SettingsState = create<SettingsState>()(
  persist(
    (set, get) => ({
      preferredExplorer: "etherscan",
      setPreferredExplorer: (preferredExplorer) => set({ preferredExplorer }),

      currency: "USD",
      setCurrency: (currency) => set({ currency }),

      customTokenLists: [] as CustomTokenList[],
      setCustomTokenLists: (customTokenLists) => set({ customTokenLists }),

      hasViewedTos: false,
      dismissTos: () => set({ hasViewedTos: true }),

      customTokens: [] as MultiChainToken[],
      setCustomTokens: (customTokens) => set({ customTokens }),

      slippage: 1,
      setSlippage: (slippage) => set({ slippage }),

      recentChainIds: [],
      addRecentChainId: (chainId) => {
        const recentChainIds = [...get().recentChainIds].filter(
          (id) => id !== chainId
        );

        recentChainIds.unshift(chainId);
        set({ recentChainIds: recentChainIds.slice(0, 8) });
      },

      rejectedCallsUpdate: [],
      addRejectedCallsUpdate: (addr) => {
        if (get().rejectedCallsUpdate.find((a) => isAddressEqual(a, addr))) {
          return;
        }

        set({ rejectedCallsUpdate: [...get().rejectedCallsUpdate, addr] });
      },
    }),
    {
      name: "settings",
      version: 3,
      migrate: (persistedState, version) => {
        if (version === 1) {
          // @ts-expect-error
          persistedState.preferredExplorer = "etherscan";
        }

        // @ts-expect-error
        persistedState.customTokens = persistedState.customTokens.filter(
          (token: MultiChainToken, index: number) => {
            // @ts-expect-error
            const i = persistedState.customTokens.findIndex(
              (x: MultiChainToken) =>
                JSON.stringify(x) === JSON.stringify(token)
            );
            return i === index;
          }
        );

        return persistedState;
      },
    }
  )
);

export const useSettingsState = createSelectorHooks(SettingsState);
