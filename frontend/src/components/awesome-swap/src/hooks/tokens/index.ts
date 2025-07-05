export { useActiveTokens } from "../use-active-tokens";
export { useAllTokens } from "../use-all-tokens";
export { useBackendTokens } from "../use-backend-tokens";
export { useCustomTokenLists } from "../use-custom-token-lists";
export { useSelectedToken } from "../use-token";
export { useTokenBalances } from "../use-token-balance";


export interface ArbitrumNativeTokenDto {
    address: string;
    decimals: number;
    logoURI?: string;
    name: string;
    symbol: string;
  }

export type DeploymentDtoArbitrumNativeToken = ArbitrumNativeTokenDto | null;

export type DeploymentType = typeof DeploymentType[keyof typeof DeploymentType];

export type DeploymentDtoConfig = OptimismConfigDto | ArbitrumConfigDto

export interface ToSDto {
    customPrivacyPolicy: string;
    customTermsOfService: string;
    forceReadPrivacyPolicy: boolean;
    forceReadTermsOfService: boolean;
  }

  
export interface ArbitrumConfigDto {
  expectedFinalizationTimeSeconds?: number;
  hasFastWithdrawals?: boolean;
}

export interface OptimismConfigDto {
    blockTimeSeconds: number;
    dataAvailabilityChallengePeriodSeconds?: number;
    disputeGameFinalityDelaySeconds?: number;
    finalizationPeriodSeconds: number;
    submissionIntervalSeconds: number;
    upgrade13?: boolean;
  }

export interface ToSDto {
    customPrivacyPolicy: string;
    customTermsOfService: string;
    forceReadPrivacyPolicy: boolean;
    forceReadTermsOfService: boolean;
  }

/**
 * @nullable
 */
export type DeploymentDtoTos = ToSDto | null;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeploymentStatus = {
    active: 'active',
    trial: 'trial',
  } as const;

export interface ActiveDeploymentStatus {
    status: typeof DeploymentStatus[keyof typeof DeploymentStatus];
  }

  export interface TrialDeploymentStatus {
    endDate: string;
    status: typeof DeploymentStatus[keyof typeof DeploymentStatus];
  }
  

export type DeploymentDtoStatus = ActiveDeploymentStatus | TrialDeploymentStatus;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeploymentType = {
  mainnet: 'mainnet',
  testnet: 'testnet',
  devnet: 'devnet',
} as const;

export interface DeploymentDto {
  /** @nullable */
  arbitrumNativeToken: DeploymentDtoArbitrumNativeToken;
  /** @nullable */
  conduitId: string | null;
  config: DeploymentDtoConfig;
  contractAddresses: DeploymentDtoContractAddresses;
  createdAt: string;
  /** @nullable */
  deletedAt: string | null;
  depositDuration: number;
  displayName: string;
  family: DeploymentFamily;
  finalizeDuration: number;
  id: string;
  l1ChainId: number;
  l2ChainId: number;
  name: string;
  /** @nullable */
  proveDuration: number | null;
  /** @nullable */
  provider: string | null;
  /** @nullable */
  rollupNetworkIcon: string | null;
  status: DeploymentDtoStatus;
  /** @nullable */
  tos: DeploymentDtoTos;
  type: DeploymentType;
}


export type DeploymentFamily = typeof DeploymentFamily[keyof typeof DeploymentFamily];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeploymentFamily = {
  optimism: 'optimism',
  arbitrum: 'arbitrum',
} as const;


export type DeploymentDtoContractAddresses = OptimismContractAddressesDto | ArbitrumContractAddressesDto

export interface ArbitrumContractAddressesDto {
  bridge: string;
  inbox: string;
  l1GatewayRouter: string;
  l2: L2ArbitrumContractAddressesDto;
  l2GatewayRouter: string;
  outbox: string;
  rollup: string;
}


export interface OptimismContractAddressesDto {
  dataAvailabilityChallenge?: string;
  disputeGameFactory?: string;
  l1CrossDomainMessenger: string;
  l1StandardBridge: string;
  l2: L2OptimismContractAddressesDto;
  l2OutputOracle?: string;
  optimismPortal: string;
  systemConfig?: string;
}


export interface L2OptimismContractAddressesDto {
    L2StandardBridge: string;
    L2ToL1MessagePasser: string;
  }

  export interface L2ArbitrumContractAddressesDto { [key: string]: unknown }
