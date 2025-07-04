import { useState } from "react";
import { formatUnits } from "viem";

import { IconCaretDown } from "./icons";
import { useSelectedToken, useTokenBalance } from "../hooks/tokens";
import { useSender } from "../hooks/use-recipient";
import { useConfigState } from "../state/config-store";
import { useFromChain } from "../hooks/use-chain";
import { Recipient } from "./Recipient";
import { TokenIcon } from "./TokenIcon";
import { Skeleton } from "./ui/Skeleton";


export const TokenInput = () => {
  const sender = useSender();
  const from = useFromChain();
  const setDisplayTokenSelector = useConfigState.useSetDisplayTokenSelector();
  const [clickedMax, setClickedMax] = useState(false);

  const rawAmount = useConfigState.useRawAmount();
  const setRawAmount = useConfigState.useSetRawAmount();

  // Use real token hooks
  const selectedToken = useSelectedToken();
  const tokenBalance = useTokenBalance(selectedToken);

  const fromToken = selectedToken?.[from?.id ?? 0];
  const formattedTokenBalance = formatUnits(
    tokenBalance.data ?? BigInt(0),
    fromToken?.decimals ?? 18
  );

  const onSetMax = () => {
    setClickedMax(true);
    setRawAmount(formattedTokenBalance);
  };

  return (
    <div
      className={`flex flex-col gap-2.5 relative rounded-2xl px-4 py-5 border border-transparent focus-within:border-border transition-colors bg-muted `}
    >
      <div className="flex gap-2 items-center">
        <input
          value={rawAmount}
          onChange={(e) => {
            const parsed = e.target.value.replaceAll(",", ".");

            if (/^[0-9]*[.]?[0-9]*$/.test(parsed)) {
              const newDecimalGroups = parsed.split(".");
              const oldDecimalGroups = rawAmount.split(".");
              if (
                fromToken &&
                newDecimalGroups.length > 1 &&
                newDecimalGroups[1].length > fromToken.decimals
              ) {
                // if someone switches to a token that doesn't have as many decimals
                // we should still let them backspace
                if (
                  oldDecimalGroups.length > 1 &&
                  newDecimalGroups[1].length > oldDecimalGroups[1].length
                ) {
                  return;
                }
              }

              setRawAmount(parsed);
            }

            setClickedMax(false);
          }}
          type="text"
          inputMode="decimal"
          minLength={1}
          maxLength={79}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="amount"
          id="amount"
          className={`block w-full shadow-none bg-transparent focus:outline-none text-4xl leading-none placeholder:text-muted-foreground text-foreground`}
          placeholder="0"
        />

        {!fromToken ? (
          <div
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-3 items-center font-button transition-all text-foreground bg-card`}
          >
            <Skeleton className="h-[25px] w-[25px] rounded-full" />
            <Skeleton className="h-[14px] w-[50px]" />
          </div>
        ) : (
          <button
            onClick={() => setDisplayTokenSelector(true)}
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-3 items-center font-button transition-all hover:scale-105 text-foreground bg-card`}
          >
            <TokenIcon
              token={fromToken}
              className="h-[20px] w-[20px] shrink-0 !text-[6px]"
            />
            {fromToken?.symbol}
            <IconCaretDown className="w-3.5 h-3.5 fill-foreground" />
          </button>
        )}
      </div>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {/* TODO: Add fiat amount display */}
        </div>

        {sender && (
          <div className="flex flex-wrap items-start justify-end gap-2">
            {tokenBalance.isLoading ? (
              <Skeleton className="h-4 w-[88px] bg-muted-foreground" />
            ) : (
              <div className="flex items-start gap-2">
                <span
                  className={`text-muted-foreground text-xs text-right leading-none`}
                >
                  Available: {parseFloat(formattedTokenBalance).toFixed(4)} {fromToken?.symbol}
                </span>

                <button
                  onClick={onSetMax}
                  className="h-5 text-[10px] font-button bg-card rounded-full px-2 py-1 -mt-1 leading-none text-muted-foreground transition-all hover:scale-105"
                >
                  Max
                </button>
              </div>
            )}
            <div className="-mt-1">
              <Recipient />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 