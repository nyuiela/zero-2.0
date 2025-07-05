import { clsx } from "clsx";
import { useState } from "react";
import { formatUnits } from "viem";
import { TokenIcon } from "../components/TokenIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useActiveTokens } from "../hooks/use-active-tokens";
import { useSelectedToken } from "../hooks/use-token";
import { useFromChain, useToChain } from "../hooks/use-chain";
import { useConfigState } from "../state/config-store";
import { formatDecimals } from "../utils/format-decimals";
import { isAddressEqual } from "../utils/is-address-equal";
import { MultiChainToken } from "../types";

// Define the actual token structure returned by useActiveTokens
interface TokenData {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name?: string;
}

// Extended interface that matches the actual data structure from useActiveTokens
interface ExtendedMultiChainToken {
  [chainId: number]: TokenData;
}

interface TokenWithBalance {
  token: ExtendedMultiChainToken;
  balance: bigint;
}

interface TokenSelectorOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const highlightedTokenStyles: { [symbol: string]: string | undefined } = {};

export const TokenSelectorOverlay: React.FC<TokenSelectorOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const from = useFromChain();
  const to = useToChain();
  const setToken = useConfigState.useSetToken();
  const tokens = useActiveTokens();
  const selectedToken = useSelectedToken();

  const filteredTokens = tokens.data?.filter(({ token }: TokenWithBalance) => {
    if (!search) {
      return true;
    }

    const fromT = token[from?.id ?? 0];
    const toT = token[to?.id ?? 0];

    return (
      fromT?.name
        ?.replace("₮", "T")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      fromT?.symbol
        ?.replace("₮", "T")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      fromT?.address?.toLowerCase().includes(search.toLowerCase()) ||
      toT?.name
        ?.replace("₮", "T")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      toT?.symbol
        ?.replace("₮", "T")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      toT?.address?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const onClickToken = (t: ExtendedMultiChainToken) => {
    const fromToken = t[from?.id ?? 0];
    const toToken = t[to?.id ?? 0];

    if (!fromToken || !toToken) {
      return;
    }

    setToken(t as MultiChainToken);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(event: Event) => event.preventDefault()}>
        <DialogHeader className="flex flex-col space-y-1.5 text-left px-6 py-6">
          <DialogTitle className="text-lg font-heading">
            Select Token
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 p-4 border-b">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            name="token"
            id="token"
            placeholder="Search"
            autoFocus
          />

          {/* highlighted tokens */}
          <div className="flex flex-wrap items-center gap-1">
            {["ETH", "USDC", "wstETH", "USDT"]
              .filter(Boolean)
              .map((symbol) => {
                const token = tokens.data?.find((t: TokenWithBalance) => {
                  const fromT = t.token[from?.id ?? 0];
                  return fromT?.symbol === symbol;
                })?.token;

                const fromToken = token?.[from?.id ?? 0];
                if (!token || !fromToken) {
                  return null;
                }

                return (
                  <div
                    key={fromToken.address}
                    className={clsx(
                      "border rounded-full flex items-center gap-1 pl-1.5 pr-3 py-1 cursor-pointer hover:bg-muted transition",
                      highlightedTokenStyles[fromToken.symbol]
                    )}
                    onClick={() => onClickToken(token)}
                  >
                    <TokenIcon token={fromToken} className="h-5 w-5" />
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm inline-flex">
                        {fromToken.symbol}
                      </span>
                      {highlightedTokenStyles[fromToken.symbol] && (
                        <span className="text-[9px] font-heading tracking-tighter text-black/30 dark:text-white/40">
                          Ad
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="overflow-y-scroll flex flex-col basis-full">
          {filteredTokens?.length === 0 ? (
            <div className="pt-8 pb-12 text-center font-heading text-sm">
              <span>No tokens found</span>
            </div>
          ) : (
            filteredTokens?.map(({ token, balance }) => (
              <TokenItem
                key={`${token[from?.id ?? 0]?.address}-${token[to?.id ?? 0]?.address}`}
                token={token}
                balance={balance}
                onClick={() => onClickToken(token)}
                selectedToken={selectedToken}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface TokenItemProps {
  token: ExtendedMultiChainToken;
  balance: bigint;
  onClick: () => void;
  selectedToken: MultiChainToken | null;
}

const TokenItem: React.FC<TokenItemProps> = ({
  balance,
  onClick,
  token,
  selectedToken,
}) => {
  const from = useFromChain();
  const to = useToChain();

  const fromToken = token[from?.id ?? 0] ?? null;
  const toToken = token[to?.id ?? 0] ?? null;

  const addUSDT0Explainer =
    fromToken?.symbol === "USDT" && toToken?.symbol === "USD₮0";

  return (
    <div
      className={clsx(
        "flex justify-between hover:bg-muted transition cursor-pointer p-4 relative",
        selectedToken &&
        fromToken &&
        toToken &&
        isAddressEqual(
          from,
          `0x${selectedToken?.[from?.id ?? 0]?.address}`,
          from,
          `0x${fromToken.address}`
        ) &&
        isAddressEqual(to, `0x${selectedToken?.[to?.id ?? 0]?.address}`, to, `0x${toToken.address}`) &&
        "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <TokenIcon token={fromToken} className="h-8 w-8" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-heading">
              {fromToken?.name || fromToken?.symbol} {addUSDT0Explainer && "(USD₮0)"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {fromToken?.symbol} {addUSDT0Explainer && "(USD₮0)"}
          </span>
        </div>
      </div>
      <div className="ml-auto flex flex-col text-right gap-1">
        <span className="text-sm text-muted-foreground">
          {formatDecimals(
            parseFloat(formatUnits(balance, fromToken?.decimals ?? 18))
          )}
        </span>
      </div>
    </div>
  );
}; 