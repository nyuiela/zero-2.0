import { useMemo } from "react";
import { useBackendTokens } from "./use-backend-tokens";
import { useCustomTokenLists } from "./use-custom-token-lists";

// TODO: Replace with real user custom tokens state
const useUserCustomTokens = () => {
  return [];
};

export function useAllTokens() {
  const backendTokens = useBackendTokens();
  const customTokenLists = useCustomTokenLists();
  const customTokens = useUserCustomTokens();

  return useMemo(
    () => ({
      isFetching: backendTokens.isFetching || customTokenLists.isFetching,
      data: [
        ...(backendTokens.data ?? []),
        ...(customTokenLists.data ?? []),
        ...customTokens,
      ],
    }),
    [backendTokens.isFetching, backendTokens.data, customTokenLists.isFetching, customTokenLists.data, customTokens]
  );
} 