import { useMemo } from "react";
import { useHost, useId } from "../hooks/use-metadata";
import { useInjectedStore } from "../state/injected-provider";
import { useHyperlaneState } from "../utils/hyperlane";
import { useHyperlaneControllerGetWarpRouteYamlFile } from "../providers/query";


export const SUPERBRIDGE_ID = "59cab143-941a-4f7f-a335-06423d003735";
export const SUPERBRIDGE_TESTNET_ID = "ec0195d1-8b25-427e-ad0c-b70646b3d28f";

export const isSuperbridge = (id: string) => SUPERBRIDGE_ID === id;
export const isSuperbridgeTestnet = (id: string) =>
  SUPERBRIDGE_TESTNET_ID === id;


export const useIsHyperlanePlayground = () => {
  const host = useHost();
  return host === "hyperlane.superbridge.app" || host === "hl.superbridge.app";
};


export const useIsLzPlayground = () => {
    const host = useHost();
    return (
      host === "lz.superbridge.app" ||
      host === "c196f5f7-6eea-4ec1-8b19-55e15eb0e46f.bridges.rollbridge.app"
    );
  };


export const useIsSuperbridge = () => {
  return isSuperbridge(useId());
};

export const useIsSuperbridgeTestnet = () => {
  return isSuperbridgeTestnet(useId());
};

export const useIsUltra = () => {
  return useId() === "d3a506b4-213b-4f53-9f06-b7f775765c8c";
};



export const useHyperlaneMailboxes = () => {
    const customRoutes = useHyperlaneCustomRoutes();
    const defaultMailboxes = useInjectedStore((s) => s.hyperlaneMailboxes);
  
    return useMemo(
      () => [...defaultMailboxes, ...(customRoutes?.mailboxes ?? [])],
      [defaultMailboxes, customRoutes?.mailboxes]
    );
  };


  export const useHyperlaneCustomRoutes = () => {
    const customRoutesId = useHyperlaneState.useCustomRoutesId();
    return useHyperlaneControllerGetWarpRouteYamlFile(customRoutesId ?? "", {
      query: { enabled: !!customRoutesId },
    }).data?.data;
  };
  