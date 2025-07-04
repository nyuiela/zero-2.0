import { useFromChain, useToChain } from "../hooks/use-chain";
import { useSender } from "../hooks/use-recipient";
import { useConfigState } from "../state/config-store";

import { Button } from "./ui/Button";

export const SwapBridgeButton = () => {
  const sender = useSender();
  const from = useFromChain();
  const to = useToChain();
  const rawAmount = useConfigState.useRawAmount();
  const token = useConfigState.useToken();

  // TODO: Replace with real validation hooks
  const isConnected = !!sender;
  const hasAmount = parseFloat(rawAmount) > 0;
  const hasToken = !!token;
  const hasChains = !!from && !!to;

  const isDisabled = !isConnected || !hasAmount || !hasToken || !hasChains;

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (!hasToken) return "Select Token";
    if (!hasAmount) return "Enter Amount";
    if (!hasChains) return "Select Networks";
    return "Bridge";
  };

  const handleClick = () => {
    if (isDisabled) return;
    
    // TODO: Implement bridge execution logic
    console.log("Bridge transaction initiated");
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      className="w-full h-12 text-base font-semibold"
    >
      {getButtonText()}
    </Button>
  );
}; 