import { useMemo } from "react";

import { ChainDto } from "../types";

export const useAddressProfile = (
  chain: ChainDto | null,
  address: string | null | undefined
) => {
  // TODO: Implement real profile fetching logic
  // For now, return a simple profile structure
  return useMemo(() => {
    if (!address || !chain) {
      return {
        isFetching: false,
        data: null,
      };
    }

    return {
      isFetching: false,
      data: {
        name: null,
        avatar: null,
      },
    };
  }, [chain, address]);
}; 