// Stub for wagmi useAccount
const useAccount = () => ({
  address: "0x0000000000000000000000000000000000000000" as const,
});

import { useConfigState } from "../state/config-store";
import { isValidAddress } from "../utils/is-valid-address";

import { useFromChain, useToChain } from "./use-chain";

export const useRecipient = () => {
  const to = useToChain();
  const evmAddress = useAccount().address;
  const recipientAddress = useConfigState.useRecipientAddress();

  if (recipientAddress) {
    if (isValidAddress(to, recipientAddress)) return recipientAddress;
    return undefined;
  }

  if (to?.solana) return undefined; // TODO: Add SVM address support
  return evmAddress;
};

export const useSender = () => {
  const from = useFromChain();
  const evmAddress = useAccount().address;

  return from?.solana ? undefined : evmAddress; // TODO: Add SVM address support
}; 