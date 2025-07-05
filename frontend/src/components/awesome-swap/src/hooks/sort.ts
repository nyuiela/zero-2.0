import {
    arbitrum,
    arbitrumSepolia,
    avalanche,
    avalancheFuji,
    base,
    baseSepolia,
    bsc,
    celo,
    fraxtal,
    holesky,
    ink,
    inkSepolia,
    lisk,
    liskSepolia,
    mainnet,
    mode,
    modeTestnet,
    optimism,
    optimismSepolia,
    polygon,
    redstone,
    sepolia,
    snax,
    soneium,
    soneiumMinato,
    superseed,
    superseedSepolia,
    swellchain,
    unichain,
    unichainSepolia,
    worldchain,
    worldchainSepolia,
    zora,
    zoraSepolia,
  } from "viem/chains";
  
  import { ChainDto } from "../types";
  
  const order: number[] = [
    mainnet.id,
    sepolia.id,
    holesky.id,
    base.id,
    baseSepolia.id,
    30168,
    40168,
    bsc.id,
    arbitrum.id,
    arbitrumSepolia.id,
    polygon.id,
    optimism.id,
    optimismSepolia.id,
    soneium.id,
    soneiumMinato.id,
    avalanche.id,
    avalancheFuji.id,
    unichain.id,
    unichainSepolia.id,
    worldchain.id,
    worldchainSepolia.id,
    ink.id,
    inkSepolia.id,
    celo.id,
    swellchain.id,
    superseed.id,
    superseedSepolia.id,
    mode.id,
    modeTestnet.id,
    zora.id,
    zoraSepolia.id,
    snax.id,
    lisk.id,
    liskSepolia.id,
    fraxtal.id,
    redstone.id,
  ];
  
  export type Sort = "Default" | "A-Z" | "Z-A";
  
  export const useSortedChains = (
    chains: (Pick<ChainDto, "id" | "name"> & { comingSoon?: true })[],
    sort: Sort
  ) => {
    return chains.sort((a, b) => {
      if (sort === "Default") {
        let aPriority = order.indexOf(a.id);
        let bPriority = order.indexOf(b.id);
  
        if (aPriority === -1) {
          aPriority = 100;
        }
        if (bPriority === -1) {
          bPriority = 100;
        }
  
        return aPriority < bPriority ? -1 : 1;
      }
  
      if (sort === "A-Z") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  };
  