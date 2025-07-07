// Euler Protocol Configuration
// Centralized config for all Euler V2 integrations

export interface EulerNetwork {
  id: number
  name: string
  subgraphUrl: string
  contracts: {
    core: {
      balanceTracker: string
      eVaultFactory: string
      eVaultImplementation: string
      eulerEarnFactory: string
      eulerEarnImplementation: string
      evc: string
      permit2: string
      protocolConfig: string
      sequenceRegistry: string
    }
    periphery: {
      adaptiveCurveIRMFactory: string
      capRiskStewardFactory: string
      edgeFactory: string
      edgeFactoryPerspective: string
      escrowedCollateralPerspective: string
      eulerEarnFactoryPerspective: string
      eulerEarnGovernedPerspective: string
      eulerUngoverned0xPerspective: string
      eulerUngovernedNzxPerspective: string
      evkFactoryPerspective: string
      externalVaultRegistry: string
      feeFlowController: string
      governedPerspective: string
      governorAccessControlEmergencyFactory: string
      irmRegistry: string
      kinkIRMFactory: string
      oracleAdapterRegistry: string
      oracleRouterFactory: string
      swapVerifier: string
      swapper: string
      termsOfUseSigner: string
    }
    lens: {
      accountLens: string
      eulerEarnVaultLens: string
      irmLens: string
      oracleLens: string
      utilsLens: string
      vaultLens: string
    }
    tokens: {
      EUL: string
      rEUL: string
    }
    bridge: {
      oftAdapter: string
    }
    governor: {
      accessControlEmergencyGovernor: string
      accessControlEmergencyGovernorAdminTimelockController: string
      accessControlEmergencyGovernorWildcardTimelockController: string
      capRiskSteward: string
      eVaultFactoryGovernor: string
      eVaultFactoryTimelockController: string
    }
    multisig: {
      DAO: string
      labs: string
      securityCouncil: string
      securityPartnerA: string
      securityPartnerB: string
    }
    eulerSwap: {
      eulerSwapV1Factory: string
      eulerSwapV1Implementation: string
      eulerSwapV1Periphery: string
    }
  }
}

// Mainnet configuration
export const EULER_MAINNET: EulerNetwork = {
  id: 1,
  name: 'Ethereum Mainnet',
  subgraphUrl: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-mainnet/1.0.6/gn',
  contracts: {
    core: {
      balanceTracker: '0x0D52d06ceB8Dcdeeb40Cfd9f17489B350dD7F8a3',
      eVaultFactory: '0x29a56a1b8214D9Cf7c5561811750D5cBDb45CC8e',
      eVaultImplementation: '0x8Ff1C814719096b61aBf00Bb46EAd0c9A529Dd7D',
      eulerEarnFactory: '0x9a20d3C0c283646e9701a049a2f8C152Bc1e3427',
      eulerEarnImplementation: '0xBa42141648dFD74388f3541C1d80fa9387043Da9',
      evc: '0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383',
      permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
      protocolConfig: '0x4cD6BF1D183264c02Be7748Cb5cd3A47d013351b',
      sequenceRegistry: '0xEADDD21618ad5Deb412D3fD23580FD461c106B54'
    },
    periphery: {
      adaptiveCurveIRMFactory: '0x3EC2d5af936bBB57DD19C292BAfb89da0E377F42',
      capRiskStewardFactory: '0x93c233008971E878d60a7737657869ab746f3208',
      edgeFactory: '0xA969B8a46166B135fD5AC533AdC28c816E1659Bd',
      edgeFactoryPerspective: '0x8c7543f83D3d295F68447792581F73d7d5D4d788',
      escrowedCollateralPerspective: '0x4e58BBEa423c4B9A2Fc7b8E58F5499f9927fADdE',
      eulerEarnFactoryPerspective: '0xC09be111D95171d1D5db43f1324005D21C098B52',
      eulerEarnGovernedPerspective: '0x747a726736DDBE6210B9d7187b3479DC5705165E',
      eulerUngoverned0xPerspective: '0xb50a07C2B0F128Faa065bD18Ea2091F5da5e7FbF',
      eulerUngovernedNzxPerspective: '0x600bBe1D0759F380Fea72B2e9B2B6DCb4A21B507',
      evkFactoryPerspective: '0xB30f23bc5F93F097B3A699f71B0b1718Fc82e182',
      externalVaultRegistry: '0xB3b30ffb54082CB861B17DfBE459370d1Cc219AC',
      feeFlowController: '0xFcd3Db06EA814eB21C84304fC7F90798C00D1e32',
      governedPerspective: '0xC0121817FF224a018840e4D15a864747d36e6Eb2',
      governorAccessControlEmergencyFactory: '0x025C8831c6E45420DF8E71F7B6b99F733D120Faf',
      irmRegistry: '0x0a64670763777E59898AE28d6ACb7f2062BF459C',
      kinkIRMFactory: '0xcAe0A39B45Ee9C3213f64392FA6DF30CE034C9F9',
      oracleAdapterRegistry: '0xA084A7F49723E3cc5722E052CF7fce910E7C5Fe6',
      oracleRouterFactory: '0x70B3f6F61b7Bf237DF04589DdAA842121072326A',
      swapVerifier: '0xae26485ACDDeFd486Fe9ad7C2b34169d360737c7',
      swapper: '0x2Bba09866b6F1025258542478C39720A09B728bF',
      termsOfUseSigner: '0x9ba11Acd88B79b657BDbD00B6dE759718AaAdCbA'
    },
    lens: {
      accountLens: '0x94B9D29721f0477402162C93d95B3b4e52425844',
      eulerEarnVaultLens: '0x189841213ae8DacB2AB40A71082E4D4c47a2458E',
      irmLens: '0x35B2Fa6206fCC6f653B75832C281bf9d4eBfeaC2',
      oracleLens: '0x0C47736aaBEE757AB8C8F60776741e39DBf3F183',
      utilsLens: '0xB8cac3e5CaaC2042B79938aFe7FEA3f44e5afcC1',
      vaultLens: '0x079FA5cdE9c9647D26E79F3520Fbdf9dbCC0E45e'
    },
    tokens: {
      EUL: '0xd9Fcd98c322942075A5C3860693e9f4f03AAE07b',
      rEUL: '0xf3e621395fc714B90dA337AA9108771597b4E696'
    },
    bridge: {
      oftAdapter: '0x4d7e09f73843Bd4735AaF7A74b6d877bac75a531'
    },
    governor: {
      accessControlEmergencyGovernor: '0x35400831044167E9E2DE613d26515eeE37e30a1b',
      accessControlEmergencyGovernorAdminTimelockController: '0xBfeE2D937FB9223FFD65b7cDF607bd1DA9B97E59',
      accessControlEmergencyGovernorWildcardTimelockController: '0x1b8C367aE56656b1D0901b2ADd1AD3226fF74f5a',
      capRiskSteward: '0xFE56cAa36DA676364e1a0a97e4f7C07651e89B95',
      eVaultFactoryGovernor: '0x2F13256E04022d6356d8CE8C53C7364e13DC1f3d',
      eVaultFactoryTimelockController: '0xfb034c1C6c7F42171b2d1Cb8486E0f43ED07A968'
    },
    multisig: {
      DAO: '0xcAD001c30E96765aC90307669d578219D4fb1DCe',
      labs: '0xB1345E7A4D35FB3E6bF22A32B3741Ae74E5Fba27',
      securityCouncil: '0xb3b84e8320250Afe7a5fb313Ee32B52982b73c53',
      securityPartnerA: '0xd5b7bC743a94978d9fE6cAcED3F09Bc194cBd471',
      securityPartnerB: '0x62962b4d506b0065a133f37e19D163E5b002b655'
    },
    eulerSwap: {
      eulerSwapV1Factory: '0xb013be1D0D380C13B58e889f412895970A2Cf228',
      eulerSwapV1Implementation: '0xc35a0FDA69e9D71e68C0d9CBb541Adfd21D6B117',
      eulerSwapV1Periphery: '0x208fF5Eb543814789321DaA1B5Eb551881D16b06'
    }
  }
}

// Base configuration
export const EULER_BASE: EulerNetwork = {
  id: 8453,
  name: 'Base',
  subgraphUrl: 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-base/1.0.8/gn',
  contracts: {
    // Base contracts would be different - using mainnet as placeholder
    // In real implementation, you'd need the actual Base addresses
    ...EULER_MAINNET.contracts
  }
}

// Add more networks as needed
export const EULER_NETWORKS: EulerNetwork[] = [
  EULER_MAINNET,
  EULER_BASE,
  // Add other networks: Swell, Sonic, BOB, Berachain, Avalanche, Arbitrum, etc.
]

// API Endpoints
export const EULER_API_ENDPOINTS = {
  priceApi: 'https://app.euler.finance/api/v1/price',
  pythHermesApi: 'https://hermes.pyth.network/v2/updates/price/latest'
}

// Common Pyth Price Feed IDs (for mainnet)
export const PYTH_PRICE_FEEDS = {
  ETH_USD: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  USDC_USD: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2808bb4f82ba0cbf',
  // Add more as needed
}

// GraphQL Queries
export const EULER_GRAPHQL_QUERIES = {
  // Get all vaults
  vaults: `
    query Vaults {
      vaults(first: 100, orderBy: totalAssets, orderDirection: desc) {
        id
        vaultName
        asset
        totalAssets
        totalBorrows
        supplyAPY
        borrowAPY
        supplyCap
        borrowCap
        interestRateModel
        collateralLTVInfo {
          collateral
          borrowLTV
          liquidationLTV
        }
      }
    }
  `,
  
  // Get account positions
  accountPositions: `
    query AccountPositions($address: ID!) {
      trackingActiveAccount(id: $address) {
        mainAddress
        deposits
        borrows
      }
    }
  `,
  
  // Get earn vaults
  earnVaults: `
    query EarnVaults {
      earnVaults(first: 100, orderBy: totalAssets, orderDirection: desc) {
        id
        name
        symbol
        asset
        totalAssets
        totalShares
        strategies {
          id
          strategy
          allocationPoints
          allocated
        }
      }
    }
  `
}

// Helper function to get network config by chain ID
export function getEulerNetwork(chainId: number): EulerNetwork | undefined {
  return EULER_NETWORKS.find(network => network.id === chainId)
}

// Helper function to get subgraph URL by chain ID
export function getEulerSubgraphUrl(chainId: number): string | undefined {
  const network = getEulerNetwork(chainId)
  return network?.subgraphUrl
}

// Helper function to get lens contract addresses by chain ID
export function getEulerLensAddresses(chainId: number) {
  const network = getEulerNetwork(chainId)
  return network?.contracts.lens
}

// Helper function to get core contract addresses by chain ID
export function getEulerCoreAddresses(chainId: number) {
  const network = getEulerNetwork(chainId)
  return network?.contracts.core
} 