import { useToChain } from "../hooks/use-chain";
import { useInjectedStore } from "../hooks/use-injected-store";
import { useRecipient } from "../hooks/use-recipient";
import { useConfigState } from "../state/config-store";

import { FromTo } from "./FromTo";
import { SwapBridgeButton } from "./SwapBridgeButton";
import { TokenInput } from "./TokenInput";

export const SwapBridgeBody = () => {
  const isWidget = useInjectedStore((s) => s.widget);
  const fiatOnramp = useConfigState.useFiatOnramp();
  const recipient = useRecipient();
  const to = useToChain();

  if (fiatOnramp) {
    return (
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Fiat Onramp</h2>
          <p className="text-muted-foreground">
            Fiat onramp functionality will be implemented here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <div className="flex flex-col gap-1.5">
        <FromTo />
        <TokenInput />
      </div>

      <SwapBridgeButton />

      {isWidget && (
        <div className="flex items-center justify-center p-3 h-auto w-full absolute bottom-0 left-0">
          <a
            href="https://superbridge.app"
            target="_blank"
            className="flex items-center justify-center gap-1 rounded-full bg-muted pl-1.5 pr-2.5 py-0.5 hover:scale-105 transition-all"
          >
            <span className="text-[10px] leading-none">
              Powered by Superbridge
            </span>
          </a>
        </div>
      )}
    </div>
  );
}; 