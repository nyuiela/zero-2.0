import { useActiveTokens } from "./use-active-tokens";

export const useTokenBalances = () => {
  const tokens = useActiveTokens();
  return tokens;
}; 