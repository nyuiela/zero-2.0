import React from "react";
import { useChains } from "../hooks/use-chains";
import { useInjectedStore } from "../hooks/use-injected-store";
import { useConfigState } from "../state/config-store";

interface NetworkSelectorOverlayProps {
  onClose?: () => void;
}

export const NetworkSelectorOverlay: React.FC<NetworkSelectorOverlayProps> = ({ onClose }) => {
  const chains = useChains();
  const fromChainId = useInjectedStore((s) => s.fromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);
  // const networkSelectorDirection = useConfigState.useNetworkSelectorDirection();
  // const setDisplayTokenNetworkSelector = useConfigState.useSetDisplayTokenNetworkSelector();
  const { setDisplayTokenNetworkSelector, networkSelectorDirection } = useConfigState();

  const handleSelect = (chainId: number) => {
    if (networkSelectorDirection === "from") {
      setFromChainId(chainId);
    } else {
      setToChainId(chainId);
    }
    setDisplayTokenNetworkSelector(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Network</h2>
          <button
            onClick={() => {
              setDisplayTokenNetworkSelector(false);
              if (onClose) onClose();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => handleSelect(chain.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${(networkSelectorDirection === "from"
                ? fromChainId === chain.id
                : toChainId === chain.id)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
                }`}
            >
              <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center font-bold">
                {chain.name.charAt(0)}
              </span>
              <span className="font-medium">{chain.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 