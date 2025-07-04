// Basic type definitions for the swap-bridge-ui package

export interface ChainDto {
  id: number;
  name: string;
  rpc: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface DeploymentDto {
  id: string;
  name: string;
  type: string;
  l1ChainId: number;
  l2ChainId: number;
}

export interface SuperbridgeConfigDto {
  highlightedTokens: Array<{
    deploymentName: string;
    address: string;
  }>;
}

export interface AcrossDomainDto {
  id: string;
  name: string;
  chainId: number;
}

export interface CcipDomainDto {
  id: string;
  name: string;
  chainId: number;
}

export interface CctpDomainDto {
  id: string;
  name: string;
  chainId: number;
}

export interface EcoDomainDto {
  id: string;
  name: string;
  chainId: number;
}

export interface HyperlaneMailboxDto {
  id: string;
  name: string;
  chainId: number;
}

export interface LzDomainDto {
  id: string;
  name: string;
  chainId: number;
}

export interface OpInteropDomainDto {
  id: string;
  name: string;
  chainId: number;
}

export interface RelayDomainDto {
  id: string;
  name: string;
  chainId: number;
}

export interface SignetChildDto {
  id: string;
  name: string;
  chainId: number;
}

export interface SignetHostDto {
  id: string;
  name: string;
  chainId: number;
}

export interface DefaultRouteDto {
  id: string;
  name: string;
}

export interface BridgeConfigDtoTos {
  accepted: boolean;
}

export interface AppConfig {
  name: string;
  description: string;
} 