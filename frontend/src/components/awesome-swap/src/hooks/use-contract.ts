import { useQuery } from "@tanstack/react-query";
import { toHex } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  zora,
} from "viem/chains";
import { useBytecode, useWalletClient } from "wagmi";

import { ChainDto } from "../types";
import { useSettingsState } from "../state/settings";

import { useFromChain } from "./use-chain";
import { useInitiatingChain } from "./use-initiating-chain-id";

const SMART_WALLET_CODE =
  "0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3";

export const SMART_WALLET_CHAIN_IDS: number[] = [
  base.id,
  optimism.id,
  arbitrum.id,
  polygon.id,
  zora.id,
  bsc.id,
  avalanche.id,
  mainnet.id,
];

export const useEvmAddress = () => {
    return useAccount().address;
  };

export const useCode = () => {
  const from = useFromChain();
  return useCodeOnChain(from);
};

export const useCodeOnChain = (chain: ChainDto | null) => {
  const evmAddress = useEvmAddress();
  return useBytecode({
    address: evmAddress,
    chainId: chain?.id,
    query: {
      refetchInterval: 10_000,
      enabled: !chain?.solana,
    },
  });
};

export const useIsSmartWallet = () => {
  const code = useCode();

  return code.data === SMART_WALLET_CODE;
};

export const useIs7702Account = () => {
  const code = useCode();

  // 7702
  if (code.data?.startsWith("0xef0100")) {
    return true;
  }

  return false;
};

export const useIs7702AccountOnChain = (chain: ChainDto | null) => {
  const code = useCodeOnChain(chain);

  // 7702
  if (code.data?.startsWith("0xef0100")) {
    return true;
  }

  return false;
};

export const useIsContractAccount = () => {
  const code = useCode();
  const is7702Account = useIs7702Account();

  if (is7702Account) {
    return false;
  }

  return !!code.data;
};

export const useIsContractAccountOnChain = (chain: ChainDto | null) => {
  const code = useCodeOnChain(chain);
  const is7702Account = useIs7702AccountOnChain(chain);

  if (is7702Account) {
    return false;
  }

  return !!code.data;
};

export const useCapabilitiesQuery = () => {
  const evmAddress = useEvmAddress();
  const initiatingChain = useInitiatingChain();
  const wallet = useWalletClient();

  return useQuery({
    queryKey: [
      "capabilities",
      evmAddress,
      initiatingChain?.id,
      wallet.data?.account?.address,
      wallet.data?.chain?.id,
    ],
    queryFn: async () => {
      if (!evmAddress || !initiatingChain?.id || !wallet.data) return false;

      const id = toHex(initiatingChain.id);
      try {
        const result = await wallet.data?.request({
          method: "wallet_getCapabilities",
          params: [evmAddress, [id]],
        });

        if (
          typeof result === "object" &&
          ["ready", "supported"].includes(result[id]?.atomic?.status)
        ) {
          return true;
        }
      } catch {}

      return false;
    },
  });
};

export const useSupportsSendCalls = () => {
  const manuallyRejectedCallsUpdate = useSettingsState.useRejectedCallsUpdate();
  const capabilities = useCapabilitiesQuery();
  const evmAddress = useEvmAddress();

  if (
    evmAddress &&
    manuallyRejectedCallsUpdate.find(
      (a) => a.toLowerCase() === evmAddress.toLowerCase()
    )
  ) {
    return false;
  }

  return capabilities.data;
};
