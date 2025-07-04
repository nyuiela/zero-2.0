import { createStore } from "zustand";

import {
    AcrossDomainDto,
    BridgeConfigDtoTos,
    CcipDomainDto,
    CctpDomainDto,
    ChainDto,
    DefaultRouteDto,
    DeploymentDto,
    EcoDomainDto,
    HyperlaneMailboxDto,
    LzDomainDto,
    OpInteropDomainDto,
    RelayDomainDto,
    SignetChildDto,
    SignetHostDto,
    SuperbridgeConfigDto,
} from "../types";
import { AppConfig } from "../types/app-config";

export type InjectedState = {
  id: string;

  /* superbridge  */
  superbridgeTestnets: boolean;
  superbridgeConfig: SuperbridgeConfigDto | null;

  deployments: DeploymentDto[];
  acrossDomains: AcrossDomainDto[];
  cctpDomains: CctpDomainDto[];
  lzDomains: LzDomainDto[];
  ccipDomains: CcipDomainDto[];
  hyperlaneMailboxes: HyperlaneMailboxDto[];
  opInteropDomains: OpInteropDomainDto[];
  ecoDomains: EcoDomainDto[];
  relayDomains: RelayDomainDto[];
  signetHosts: SignetHostDto[];
  signetChildren: SignetChildDto[];
  fromChainId: number;
  toChainId: number;
  chains: ChainDto[];

  app: AppConfig;
  host: string;

  widget: boolean;

  isPaid: boolean;
  deletedAt: number | null;
  defaultRoute: DefaultRouteDto | null;
  supportsOnRamp: boolean;
  tos: BridgeConfigDtoTos;
  tokensId: string | null;
};

export type InjectedActions = {
  setSuperbridgeTestnets: (b: boolean) => void;
  setFromChainId: (id: number) => void;
  setToChainId: (id: number) => void;
};

export type InjectedStore = InjectedState & InjectedActions;

export const createInjectedStore = (initState: InjectedState) => {
  const s = { ...initState };

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);

    const [deploymentTokenUndefined]: (string | undefined)[] =
      window.location.pathname.split(/[?\/]/).filter(Boolean);
    const deployment = s.deployments.find(
      (d) => d.name === deploymentTokenUndefined
    );
    if (deployment) {
      if (params.get("direction") === "withdraw") {
        s.fromChainId = deployment.l2ChainId;
        s.toChainId = deployment.l1ChainId;
      } else {
        s.fromChainId = deployment.l1ChainId;
        s.toChainId = deployment.l2ChainId;
      }

      if (s.id === "superbridge" && deployment.type === "testnet") {
        s.superbridgeTestnets = true;
      }
    }

    const fromChainId = params.get("fromChainId");
    const toChainId = params.get("toChainId");
    if (fromChainId && toChainId) {
      const from = s.chains.find((c) => c.id === parseInt(fromChainId));
      const to = s.chains.find((c) => c.id === parseInt(toChainId));
      if (from && to) {
        s.fromChainId = from.id;
        s.toChainId = to.id;
      }
    }
  }

  return createStore<InjectedStore>()((set) => ({
    ...s,

    setSuperbridgeTestnets: (superbridgeTestnets) =>
      set({ superbridgeTestnets }),
    setFromChainId: (fromChainId) => set({ fromChainId }),
    setToChainId: (toChainId) => set({ toChainId }),
  }));
}; 