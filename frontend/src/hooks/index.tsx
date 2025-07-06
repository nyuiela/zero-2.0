import React from "react";
import { SwapBridgeModal } from "@/components/awesome-swap/src/components/SwapBridgeModal";
import { SwapBridgeProvider } from "@/components/awesome-swap/src/providers/SwapBridgeProvider";


const SwapBridgePage = () => {
  return (
    <SwapBridgeProvider injectedState={{
      id: "",
      superbridgeTestnets: false,
      superbridgeConfig: null,
      deployments: [],
      acrossDomains: [],
      cctpDomains: [],
      lzDomains: [],
      ccipDomains: [],
      hyperlaneMailboxes: [],
      opInteropDomains: [],
      ecoDomains: [],
      relayDomains: [],
      signetHosts: [],
      signetChildren: [],
      fromChainId: 0,
      toChainId: 0,
      chains: [],
      app: {
        name: "Zero 2.0",
        description: "Zero 2.0",
        version: "1.0.0",
        theme: {
          primaryColor: "#000000",
          backgroundColor: "#ffffff",
        },
      },
      host: "",
      widget: false,
      isPaid: false,
      deletedAt: null,
      defaultRoute: null,
      supportsOnRamp: false,
      tos: {
        accepted: true,
      },
      tokensId: null
    }}>
      <div style={{ minHeight: "100vh", background: "#e9d5ff" }}>
        <SwapBridgeModal />
      </div>
    </SwapBridgeProvider>
  );
};

export default SwapBridgePage; 