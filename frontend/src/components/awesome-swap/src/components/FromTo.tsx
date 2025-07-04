import clsx from "clsx";

import { useFromChain, useToChain } from "../hooks/use-chain";
import { useChains } from "../hooks/use-chains";
import { useInjectedStore } from "../hooks/use-injected-store";
import { useConfigState } from "../state/config-store";

import { IconCaretRight } from "./icons/IconCaretRight";
import { NetworkIcon } from "./NetworkIcon";

export const FromTo = () => {
  const chains = useChains();
  const from = useFromChain();
  const to = useToChain();
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);
  const setDisplayTokenNetworkSelector =
    useConfigState.useSetDisplayTokenNetworkSelector();
  const setNetworkSelectorDirection =
    useConfigState.useSetNetworkSelectorDirection();

  const networkSelectorEnabled = chains.length > 2;

  const switchChains = () => {
    if (!from || !to) return;

    setToChainId(from.id);
    setFromChainId(to.id);
  };

  const onClick = (dir: "from" | "to") => () => {
    if (networkSelectorEnabled) {
      setNetworkSelectorDirection(dir);
      setDisplayTokenNetworkSelector(true);
    } else {
      switchChains();
    }
  };

  return (
    <div
      className={`relative grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-1 select-none pt-0.5`}
    >
      <div
        className={clsx(
          "flex gap-2 w-full items-start justify-start bg-muted p-4 rounded-xl transition-all md:origin-right grow-1",
          "cursor-pointer hover:scale-[1.02]"
        )}
        onClick={onClick("from")}
      >
        <NetworkIcon
          chain={from}
          width={32}
          height={32}
          className="pointer-events-none rounded-sm"
        />
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            From
          </span>
          <span className="leading-none font-button">{from?.name}</span>
        </div>
      </div>
      <button
        onClick={switchChains}
        className="flex justify-center items-center rounded-lg w-8 h-8 bg-muted border-[3px] border-card backdrop-blur-md absolute z-[999] left-1/2 top-1/2 -translate-x-[50%] -translate-y-2/4 transition-all scale-90 hover:scale-100 rotate-90 md:rotate-0"
      >
        <IconCaretRight className="w-3 h-3 fill-muted-foreground" />
      </button>

      <div
        className={clsx(
          "flex gap-2 w-full items-start md:flex-row-reverse bg-muted p-4 rounded-xl transition-all md:origin-left",
          "cursor-pointer hover:scale-[1.02]"
        )}
        onClick={onClick("to")}
      >
        <NetworkIcon
          chain={to}
          width={32}
          height={32}
          className="pointer-events-none rounded-sm"
        />
        <div className="flex flex-col gap-0.5 md:text-right">
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            To
          </span>
          <span className="leading-none font-button">{to?.name}</span>
        </div>
      </div>
    </div>
  );
}; 