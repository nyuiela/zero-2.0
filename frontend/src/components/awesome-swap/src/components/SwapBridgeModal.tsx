import clsx from "clsx";

import { useInjectedStore } from "../hooks/use-injected-store";
import { useConfigState } from "../state/config-store";

import { NetworkSelectorOverlay } from "../overlays/NetworkSelectorOverlay";
import { TokenSelectorOverlay } from "../overlays/TokenSelectorOverlay";
import { SwapBridgeBody } from "./SwapBridgeBody";
import { SwapBridgeHeader } from "./SwapBridgeHeader";

export const SwapBridgeModal = () => {
  const isWidget = useInjectedStore((s) => s.widget);
  const deletedAt = useInjectedStore((s) => s.deletedAt);
  
  const displayTokenNetworkSelector = useConfigState.useDisplayTokenNetworkSelector();
  const setDisplayTokenNetworkSelector = useConfigState.useSetDisplayTokenNetworkSelector();
  const displayTokenSelector = useConfigState.useDisplayTokenSelector();
  const setDisplayTokenSelector = useConfigState.useSetDisplayTokenSelector();

  return (
    <main
      className="relative flex flex-col items-center justify-start w-screen h-screen inset-0 overflow-y-auto overflow-x-hidden"
      key="bridgeMain"
    >
      <div
        className={clsx(
          "w-full",
          isWidget
            ? "absolute inset-0 h-full"
            : "relative px-2 md:px-0 md:w-[468px] mb-24 mt-20 sm:mt-24 2xl:mt-32"
        )}
      >
        <div className="flex flex-col gap-2 items-center h-full">
          {deletedAt && deletedAt < Date.now() ? (
            <div className="w-full bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm shrink-0">
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Bridge Deleted</h2>
                <p className="text-muted-foreground">
                  This bridge has been deleted and is no longer available.
                </p>
              </div>
            </div>
          ) : (
            <>
              {!isWidget && <SwapBridgeHeader />}
              <div
                className={clsx(
                  "bg-card",
                  !isWidget &&
                    "rounded-t-[24px] rounded-b-[32px] shadow-sm w-full",
                  isWidget && "h-screen w-screen"
                )}
              >
                {isWidget && <SwapBridgeHeader />}
                <SwapBridgeBody />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlays */}
      <NetworkSelectorOverlay
        // isOpen={displayTokenNetworkSelector}
        onClose={() => setDisplayTokenNetworkSelector(false)}
      />
      <TokenSelectorOverlay
        isOpen={displayTokenSelector}
        onClose={() => setDisplayTokenSelector(false)}
      />
    </main>
  );
}; 