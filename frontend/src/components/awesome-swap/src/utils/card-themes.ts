import {
    ancient8,
    ancient8Sepolia,
    arbitrum,
    arbitrumSepolia,
    avalanche,
    avalancheFuji,
    base,
    baseSepolia,
    berachainBepolia,
    blast,
    bob,
    bobSepolia,
    bsc,
    bscTestnet,
    celo,
    celoAlfajores,
    cyber,
    cyberTestnet,
    flowMainnet,
    flowTestnet,
    fraxtal,
    fraxtalTestnet,
    holesky,
    inEVM,
    linea,
    lisk,
    liskSepolia,
    lyra,
    mainnet,
    metalL2,
    mintSepoliaTestnet,
    mode,
    modeTestnet,
    optimism,
    optimismSepolia,
    pgn,
    pgnTestnet,
    polygon,
    polygonAmoy,
    redstone,
    scroll,
    sepolia,
    shapeSepolia,
    snax,
    snaxTestnet,
    swan,
    swanProximaTestnet,
    swanSaturnTestnet,
    zircuitTestnet,
    zora,
    zoraSepolia,
  } from "viem/chains";
  
  interface CardTheme {
    className?: string;
    overlay?: {
      className?: string;
      image?: string;
    };
    title?: string;
  }
  
  export const defaultCardTheme: { card: CardTheme; icon: string } = {
    icon: "/img/default/icon.svg",
    card: {
      className: "bg-[#A882FD]",
      title: "text-white",
      overlay: {
        className:
          "bg-[url('/img/default/bg.svg')] bg-repeat bg-center bg-[length:16px_16px] opacity-15",
      },
    },
  };
  
  const baseTheme = {
    icon: "/img/base/icon.svg",
    card: {
      className: "bg-blue-600",
      title: "text-white",
    },
  };
  
  const optimismTheme = {
    icon: "/img/optimism/icon.svg",
    card: {
      className: "bg-[#FF0420]",
      title: "text-white",
    },
  };
  
  const zoraTheme = {
    icon: "/img/zora/icon.svg",
    card: {
      className: "bg-[#006FFE]",
      title: "text-white",
      overlay: {
        image: "/img/zora/bg.jpg",
        className: "w-full h-full mix-blend-screen opacity-100",
      },
    },
  };
  
  const modeTheme = {
    icon: "/img/mode/icon.svg",
    card: {
      className: "bg-[#DFFE00]",
      title: "text-black",
      overlay: {
        className:
          "bg-[url('/img/mode/bg.svg')] bg-repeat bg-center bg-[length:15px_15px] opacity-50",
      },
    },
  };
  
  const aevoTheme = {
    icon: "/img/aevo/icon.svg",
    card: {
      className: "bg-zinc-950",
    },
  };
  
  const lyraTheme = {
    icon: "/img/lyra/icon.svg",
    card: {
      className: "bg-[#26FAB0]",
      title: "text-black",
    },
  };
  
  const onyxTheme = {
    icon: "/img/onyx/icon.svg",
    card: {
      className: "bg-[#211F20]",
      title: "text-white",
    },
  };
  
  const orderlyTheme = {
    icon: "/img/orderly/icon.svg",
    card: {
      className: "bg-gradient-to-t from-[#4D00B1] via-[#7C3FCB] to-[#7C3FCB]",
      title: "text-white",
    },
  };
  
  const ancient8Theme = {
    icon: "/img/ancient8/icon.svg",
    card: {
      className: "bg-gradient-to-t from-[#C7F18C] to-[#AEE760]",
      title: "text-black",
    },
  };
  
  const pgnTheme = {
    icon: "/img/pgn/icon.svg",
    card: {
      className: "bg-[#3CE046]",
      overlay: {
        image: "/img/pgn/bg.png",
        className: "w-full h-full",
      },
    },
  };
  
  const uniswapTheme = {
    icon: "/img/uniswap-icon.svg",
    card: {
      className: "bg-[#EB79F7]",
    },
  };
  
  const kromaTheme = {
    icon: "/img/kroma/icon.svg",
    card: {
      className: "bg-[#72DE2F]",
      overlay: {
        className:
          "bg-gradient-to-t from-teal-950 via-teal-950/0 to-teal-950/0 mix-blend-screen opacity-100",
      },
    },
  };
  
  const arbitrumOneTheme = {
    icon: "/img/arbitrum-one/icon.svg",
    card: {
      className: "bg-[#1C4ADD]",
      title: "text-white",
      overlay: {
        image: "/img/arbitrum-one/bg.png",
        className: "h-full w-full mix-blend-overlay opacity-80",
      },
    },
  };
  
  const arbitrumNovaTheme = {
    icon: "/img/arbitrum-nova/icon.svg",
    card: {
      className: "bg-[#E57410]",
      title: "text-white",
      overlay: {
        image: "/img/arbitrum-nova/bg.png",
        className: "h-full w-full mix-blend-overlay opacity-20",
      },
    },
  };
  
  const redstoneTheme = {
    icon: "/img/redstone-mainnet/icon.svg",
    card: {
      className: "bg-[#F34242]",
      title: "text-white",
    },
  };
  
  const liskTheme = {
    icon: "/img/lisk-mainnet/icon.svg",
    card: {
      className: "bg-gradient-to-b from-black via-[#1E134D] to-[#5B3CF3] ",
      title: "text-white",
    },
  };
  
  const lumioTheme = {
    icon: "/img/lumio-mainnet/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#2F2B54] to-[#0F0B2D] ",
      title: "text-white",
    },
  };
  
  const metalTheme = {
    icon: "/img/metal-mainnet/icon.svg",
    card: {
      className: "bg-white",
      title: "text-white",
      overlay: {
        image: "/img/metal-mainnet/bg-card.jpg",
        className: "w-full h-full opacity-100",
      },
    },
  };
  
  const fraxTheme = {
    icon: "/img/frax-mainnet/icon.svg",
    card: {
      className: "bg-[#070707] border border-white/5",
      title: "text-white",
    },
  };
  
  const mintTheme = {
    icon: "/img/mint-mainnet/icon.svg",
    card: {
      className: "bg-[#30BF54]",
      title: "text-white",
    },
  };
  
  const worldchainTheme = {
    icon: "/img/worldchain-mainnet/icon.svg",
    card: {
      className: "bg-black",
      title: "text-white",
    },
  };
  
  const cyberTheme = {
    icon: "/img/cyber-mainnet/icon.svg",
    card: {
      className: "bg-[#EAFFE7]",
      title: "text-zinc-900",
    },
  };
  
  const xterioTheme = {
    icon: "/img/xterio-chain-eth/icon.svg",
    card: {
      className: "bg-black",
      title: "text-white",
      overlay: {
        image: "/img/xterio-chain-eth/bg-card.png",
        className: "bg-cover bg-center opacity-100",
      },
    },
  };
  
  const celoTheme = {
    icon: "/img/celo/icon.svg",
    card: {
      className: "bg-[#FFFF52]",
      title: "text-black",
    },
  };
  
  const blastTheme = {
    icon: "/img/blast/icon.svg",
    card: {
      className: "bg-black border border-white/5",
      title: "text-white",
    },
  };
  
  const lineaTheme = {
    icon: "/img/linea/icon.svg",
    card: {
      className: "bg-[#121212]",
      title: "text-white",
      overlay: {
        className:
          "bg-[url('/img/linea/bg.svg')] bg-no-repeat bg-contain opacity-30",
      },
    },
  };
  
  const ethereumTheme = {
    icon: "/img/ethereum/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#88AAF1] to-[#C9B3F5]",
      title: "text-white",
    },
  };
  
  const bscTheme = {
    icon: "/img/bsc/icon.svg",
    card: {
      className: "bg-[#FFE900]",
      title: "text-[#181A1E]",
    },
  };
  
  const victionTheme = {
    icon: "/img/viction/icon.svg",
    card: {
      className: "bg-[#F8F6D7]",
      title: "text-[#231F20]",
    },
  };
  
  const injectiveTheme = {
    icon: "/img/injective/icon.svg",
    card: {
      className: "bg-[#ECF3FB]",
      title: "text-[#231F20]",
      overlay: {
        className:
          "bg-gradient-to-br from-[#32B2FD] via-[#ECF3FB] to-[#A85CFC] opacity-40",
      },
    },
  };
  
  const avalancheTheme = {
    card: {
      className: "bg-[#E84142]",
      title: "text-[#ffffff]",
    },
    icon: "/img/avalanche/icon.svg",
  };
  
  const scrollTheme = {
    card: {
      className: "bg-[#FADFBA]",
      title: "text-[#101010]",
    },
    icon: "/img/scroll/icon.svg",
  };
  
  const polygonTheme = {
    card: {
      className: "bg-gradient-to-b from-[#7F49F3] to-[#693CC8]",
      title: "text-white",
    },
    icon: "/img/polygon/icon.svg",
  };
  
  const polygonAmoyTheme = {
    card: {
      className: "bg-gradient-to-tr from-[#7F49F3] to-[#693CC8]",
      title: "text-white",
    },
    icon: "/img/polygon/icon.svg",
  };
  
  export const shapeTheme = {
    icon: "/img/shape/icon.svg",
    card: {
      className: "bg-[#31E3DF]",
      title: "text-black",
    },
  };
  
  const zircuitTheme = {
    icon: "/img/zircuit/icon.svg",
    card: {
      className: "bg-[#F6F3E9]",
      title: "text-black",
    },
  };
  
  const degenTheme = {
    icon: "/img/degen/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#0F172A] to-[#412978]",
      title: "text-white",
    },
  };
  
  const fuseTheme = {
    icon: "/img/fuse/icon.svg",
    card: {
      className: "bg-[#BAFEC0]",
      title: "text-black",
    },
  };
  
  const gnosisTheme = {
    icon: "/img/gnosis/icon.svg",
    card: {
      className: "bg-[#133629]",
      title: "text-white",
    },
  };
  
  const luksoTheme = {
    icon: "/img/lukso/icon.svg",
    card: {
      className: "bg-white",
      title: "text-black",
    },
  };
  
  const mantleTheme = {
    icon: "/img/mantle/icon.svg",
    card: {
      className: "bg-black",
      title: "text-white",
    },
  };
  
  const merlinTheme = {
    icon: "/img/merlin/icon.svg",
    card: {
      className: "bg-[#0F0832]",
      title: "text-white",
    },
  };
  
  const metisTheme = {
    icon: "/img/metis/icon.svg",
    card: {
      className: "bg-[#00CFFF]",
      title: "text-white",
    },
  };
  
  const moonbeamTheme = {
    icon: "/img/moonbeam/icon.svg",
    card: {
      className: "bg-[url('/img/moonbeam/bg.svg')] bg-no-repeat bg-cover",
      title: "text-white",
    },
  };
  
  const polygonZkEvmTheme = {
    icon: "/img/polygonzkevm/icon.svg",
    card: {
      className: "bg-[#6C00F6]",
      title: "text-white",
    },
  };
  
  const realTheme = {
    icon: "/img/real/icon.svg",
    card: {
      className: "bg-gradient-to-t from-[#D0D3E2] to-[#F5F6FB]",
      title: "text-black",
    },
  };
  
  const seiTheme = {
    icon: "/img/sei/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#F2E9E9] to-[#ecedee]",
      title: "text-black",
    },
  };
  
  const taikoTheme = {
    icon: "/img/taiko/icon.svg",
    card: {
      className: "bg-[#E81899]",
      title: "text-white",
    },
  };
  
  const xiaTheme = {
    icon: "/img/xia/icon.svg",
    card: {
      className: "bg-[#FF0030]",
      title: "text-white",
    },
  };
  
  const xlayerTheme = {
    icon: "/img/xlayer/icon.svg",
    card: {
      className: "bg-gradient-to-b from-zinc-900 to-zinc-950",
      title: "text-white",
    },
  };
  
  const zetaTheme = {
    icon: "/img/zeta/icon.svg",
    card: {
      className: "bg-[#005741]",
      title: "text-white",
    },
  };
  
  const cheesechainTheme = {
    icon: "/img/cheesechain/icon.png",
    card: {
      className: "bg-[#03F3F2]",
      title: "text-zinc-900",
    },
  };
  
  const proofofplayTheme = {
    icon: "/img/proofofplay/icon.svg",
    card: {
      className: "bg-gradient-to-tr from-[#863AF8] to-[#37D7D5]",
      title: "text-white",
    },
  };
  
  const sankoTheme = {
    icon: "/img/sanko/icon.png",
    card: {
      className: "bg-[#11131E]",
      title: "text-white",
    },
  };
  
  const enduranceTheme = {
    icon: "/img/endurance/icon.png",
    card: {
      className: "bg-gradient-to-bl from-[#936A48] to-[#1C1B25]",
      title: "text-white",
    },
  };
  
  export const moltenTheme = {
    icon: "/img/molten/icon.svg",
    card: {
      className: "bg-zinc-900",
      title: "text-white",
    },
  };
  const mantaTheme = {
    icon: "/img/manta/icon.svg",
    card: {
      className: "bg-gradient-to-tr from-[#29CCB9] via-[#0091FF] to-[#FF66B7]",
      title: "text-white",
    },
  };
  
  const bobTheme = {
    icon: "/img/bob/icon.svg",
    card: {
      className: "bg-[#F25D00]",
      title: "text-white",
    },
  };
  
  const formTheme = {
    icon: "/img/form/icon.svg",
    card: {
      className: "bg-black",
      title: "text-white",
      overlay: {
        className:
          "bg-[url('/img/form/bg-card.jpg')] bg-center bg-cover opacity-70",
      },
    },
  };
  const campTheme = {
    icon: "/img/camp/icon.svg",
    card: {
      className: "bg-white border-black/5",
      title: "text-black",
    },
  };
  const citreaTheme = {
    icon: "/img/citrea/icon.svg",
    card: {
      className: "bg-white",
      title: "text-black",
      overlay: {
        className: "bg-[url('/img/citrea/bg-card.svg')] bg-bottom bg-cover",
      },
    },
  };
  const suaveTheme = {
    icon: "/img/suave/icon.png",
    card: {
      className: "bg-white border border-black/5",
      title: "text-black",
    },
  };
  const soneiumTheme = {
    icon: "/img/soneium/icon.png",
    card: {
      className: "bg-black",
      title: "text-white",
    },
  };
  const beraBartioTheme = {
    icon: "/img/berachainBArtio/icon.svg",
    card: {
      className: "bg-[#F8F2E9]",
      title: "text-black",
    },
  };
  const berachainTheme = {
    icon: "/img/berachain/icon.svg",
    card: {
      className: "bg-[url('/img/berachain/bg-card.svg')] bg-cover",
      title: "text-[#F9F4D5]",
    },
  };
  const formaTheme = {
    icon: "/img/forma/icon.svg",
    card: {
      className: "bg-black",
      title: "text-white",
    },
  };
  const unichainTheme = {
    icon: "/img/unichain/icon.svg",
    card: {
      className: "bg-[#F50DB4]",
      title: "text-black",
      overlay: {
        className: "bg-[url('/img/unichain/bg-card.jpg')] bg-bottom bg-cover",
      },
    },
  };
  
  const inkTheme = {
    icon: "/img/ink/icon.svg",
    card: {
      className: "bg-[#7538F5]",
      title: "text-white",
    },
  };
  
  const snaxTheme = {
    icon: "/img/snax/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#06061B] to-[#170C34]",
      title: "text-white",
    },
  };
  
  const raceTheme = {
    icon: "/img/race/icon.svg",
    card: {
      className: "bg-[#05141B]",
      title: "text-white",
      overlay: {
        image: "/img/race/bg-card.jpg",
        className: "bg-cover bg-bottom bg-no-repeat",
      },
    },
  };
  
  const swanTheme = {
    icon: "/img/swanchain/icon.svg",
    card: {
      className: "bg-[#447DFF]",
      title: "text-white",
      overlay: {
        image: "/img/swanchain/bg-card.svg",
        className: "bg-cover bg-bottom bg-no-repeat mix-blend-multiply",
      },
    },
  };
  
  const arenaZTheme = {
    icon: "/img/arena-z/icon.svg",
    card: {
      className: "bg-[#0D054A]",
      title: "text-white",
      overlay: {
        className: "bg-[url('/img/arena-z/bg-card.svg')] bg-bottom bg-cover",
      },
    },
  };
  
  const tangleTheme = {
    icon: "/img/tangle/icon.svg",
    card: {
      className: "bg-gradient-to-t from-[#F0F0F8] to-white",
      title: "text-black",
    },
  };
  
  const auraTheme = {
    icon: "/img/aura/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#0C0B0A] to-[#18120B]",
      title: "text-white",
    },
  };
  
  const lumiaTheme = {
    icon: "/img/lumia/icon.svg",
    card: {
      className: "bg-[#010101]",
      title: "text-white",
    },
  };
  
  const storyTheme = {
    icon: "/img/story/icon.svg",
    card: {
      className: "bg-[#010101]",
      title: "text-white",
    },
  };
  
  const odysseyTheme = {
    icon: "/img/odyssey/icon.svg",
    card: {
      className: "bg-[#F6F3F3]",
      title: "text-black",
    },
  };
  
  const ethenaTheme = {
    icon: "/img/ethena/icon.svg",
    card: {
      className: "bg-gradient-to-t from-[#1c1c1c] to-[#3a3a3a]",
      title: "text-white",
    },
  };
  
  const zkEraTheme = {
    icon: "/img/zkera/icon.svg",
    card: {
      className: "bg-gradient-to-br from-[#06102F] to-[#010101]",
      title: "text-white",
    },
  };
  
  const kavaTheme = {
    icon: "/img/kava/icon.svg",
    card: {
      className: "bg-gradient-to-br from-[#FF433E] to-[#ef8534]",
      title: "text-white",
      overlay: {
        className:
          "bg-[url('/img/kava/bg-card.svg')] bg-bottom bg-cover mix-blend-multiply opacity-50",
      },
    },
  };
  
  const apeChainTheme = {
    icon: "/img/apechain/icon.svg",
    card: {
      className: "bg-[#0054FA]",
      title: "text-white",
    },
  };
  
  const gravityTheme = {
    icon: "/img/gravity/icon.svg",
    card: {
      className: "bg-[url('/img/gravity/bg-card.jpg')] bg-cover",
      title: "text-white",
    },
  };
  
  const flowTheme = {
    icon: "/img/flow/icon.svg",
    card: {
      className: "bg-[#00EF8B]",
      title: "text-white",
    },
  };
  
  const bnryTheme = {
    icon: "/img/bnry/icon.svg",
    card: {
      className: "bg-[url('/img/bnry/bg-card.png')] bg-cover",
      title: "text-white",
    },
  };
  
  const polynominalTheme = {
    icon: "/img/polynominal/icon.svg",
    card: {
      className: "bg-gradient-to-br from-[#080808] to-[#2C370C]",
      title: "text-white",
    },
  };
  
  const ozeanTheme = {
    icon: "/img/ozean/icon.svg",
    card: {
      className: "bg-[#0040FF]",
      title: "text-white",
      overlay: {
        className: "bg-[url('/img/ozean/bg-card.svg')] bg-repeat opacity-50",
      },
    },
  };
  
  const ozeanPoseidonTheme = {
    icon: "/img/ozean-poseidon/icon.svg",
    card: {
      className: "bg-[#0040FF]",
      title: "text-white",
      overlay: {
        className:
          "bg-[url('/img/ozean-poseidon/bg-card.svg')] bg-repeat opacity-50",
      },
    },
  };
  
  const deriveTheme = {
    icon: "/img/derive/icon.svg",
    card: {
      className: "bg-[url('/img/derive/bg-card.png')] bg-contain",
      title: "text-white",
    },
  };
  
  const hamTheme = {
    icon: "/img/ham/icon.svg",
    card: {
      className: "bg-white border border-2 border-[#EB4747]",
      title: "text-[#EB4747]",
    },
  };
  
  const gameswiftTheme = {
    icon: "/img/gameswift/icon.svg",
    card: {
      className: "bg-gradient-to-br from-[#141519] to-black",
      title: "text-white",
    },
  };
  
  const funkiTheme = {
    icon: "/img/funki/icon.svg",
    card: {
      className: "bg-[#680DFE]",
      title: "text-white",
    },
  };
  
  const fractalTheme = {
    icon: "/img/fractal/icon.svg",
    card: {
      className: "bg-[#2539EF]",
      title: "text-white",
    },
  };
  
  const ethernityTheme = {
    icon: "/img/ethernity/icon.svg",
    card: {
      className: "bg-gradient-to-br from-[#191045] to-[#030418]",
      title: "text-white",
    },
  };
  
  const donatuzTheme = {
    icon: "/img/donatuz/icon.png",
    card: {
      className: "bg-gradient-to-br from-[#04063D] to-[#1C0B75]",
      title: "text-white",
    },
  };
  
  const bobaTheme = {
    icon: "/img/boba/icon.svg",
    card: {
      className: "bg-[#E5E6E1]",
      title: "text-black",
    },
  };
  const alloTheme = {
    icon: "/img/allo/icon.svg",
    card: {
      className: "bg-[#F7931A]",
      title: "text-white",
    },
  };
  
  const nodgamesTheme = {
    icon: "/img/nodgames/icon.svg",
    card: {
      className: "bg-[#251D1C]",
      title: "text-white",
    },
  };
  
  const superseedTheme = {
    icon: "/img/superseed/icon.svg",
    card: {
      className: "bg-[#000000]",
      title: "text-white",
    },
  };
  
  const creatorTheme = {
    icon: "/img/creator/icon.svg",
    card: {
      className: "bg-[#F5E203]",
      title: "text-black",
    },
  };
  
  const opbnbTheme = {
    icon: "/img/opbnb/icon.svg",
    card: {
      className: "bg-[#181A1E]",
      title: "text-white",
    },
  };
  
  const auroraTheme = {
    icon: "/img/aurora/icon.svg",
    card: {
      className: "bg-[url('/img/aurora/bg-card.jpg')] bg-cover",
      title: "text-white",
    },
  };
  
  const fantomTheme = {
    icon: "/img/fantom/icon.svg",
    card: {
      className: "bg-[#1969FF]",
      title: "text-white",
    },
  };
  
  const sonicTheme = {
    icon: "/img/sonic/icon.svg",
    card: {
      className: "bg-[url('/img/sonic/bg-card.png')] bg-cover",
      title: "text-white",
    },
  };
  
  const coreTheme = {
    icon: "/img/core/icon.svg",
    card: {
      className: "bg-[url('/img/core/bg-card.svg')] bg-cover",
      title: "text-white",
    },
  };
  
  const zeroTheme = {
    icon: "/img/zero/icon.svg",
    card: {
      className: "bg-[url('/img/zero/bg-card.svg')] bg-cover",
      title: "text-white",
    },
  };
  
  const astarTheme = {
    icon: "/img/astar/icon.svg",
    card: {
      className: "bg-gradient-to-br from-[#fff] to-[#E3F6FA]",
      title: "text-black",
    },
  };
  
  const astarZkTheme = {
    icon: "/img/astar-zk/icon.svg",
    card: {
      className: "bg-gradient-to-br from-[#fff] to-[#E3F6FA]",
      title: "text-black",
    },
  };
  
  const abstractTheme = {
    icon: "/img/abstract/icon.svg",
    card: {
      className:
        "bg-gradient-to-br from-[#74ffde] via-[#00de73] via-[#41f09c] via-[#03d26e] to-[#00c466]",
      title: "text-white",
    },
  };
  
  const kalychainTheme = {
    icon: "/img/kalychain/icon.svg",
    card: {
      className: "bg-[#252525]",
      title: "text-white",
    },
  };
  
  const moonriverTheme = {
    icon: "/img/moonriver/icon.svg",
    card: {
      className: "bg-[#15333D]",
      title: "text-white",
    },
  };
  
  const plumeTheme = {
    icon: "/img/plume/icon.svg",
    card: {
      className: "bg-[#FF3D00]",
      title: "text-white",
    },
  };
  
  const swellTheme = {
    icon: "/img/swell/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#11012C] to-[#290368]",
      title: "text-white",
    },
  };
  
  const EtherlinkTheme = {
    icon: "/img/etherlink/icon.svg",
    card: {
      className: "bg-[url('/img/etherlink/bg-card.svg')] bg-cover",
      title: "text-white",
    },
  };
  
  // const swellTheme = {
  //   icon: "/img/swell/icon.svg",
  //   card: {
  //     className: "bg-gradient-to-br from-[#3068EF] to-[#2F43EC]",
  //     title: "text-white",
  //   },
  // };
  
  const flareTheme = {
    icon: "/img/flare/icon.svg",
    card: {
      className: "bg-[url('/img/flare/bg-card.svg')] bg-cover",
      title: "text-black",
    },
  };
  
  const iotaTheme = {
    icon: "/img/iota/icon.svg",
    card: {
      className: "bg-[url('/img/iota/bg-card.jpg')] bg-cover",
      title: "text-white",
    },
  };
  
  const telosTheme = {
    icon: "/img/telos/icon.svg",
    card: {
      className: "bg-white",
      title: "text-black",
    },
  };
  
  const peaqTheme = {
    icon: "/img/peaq/icon.svg",
    card: {
      className: "bg-[#2F1D74]",
      title: "text-white",
    },
  };
  const lightlinkTheme = {
    icon: "/img/lightlink/icon.svg",
    card: {
      className: "bg-[#2F2D7B]",
      title: "text-white",
    },
  };
  
  const b2Theme = {
    icon: "/img/b2/icon.svg",
    card: {
      className: "bg-gradient-to-t from-[#FFB852] via-[#FFDFB6] to-[#FFE3BD]",
      title: "text-black",
    },
  };
  
  const superpositionTheme = {
    icon: "/img/superposition/icon.svg",
    card: {
      className: "bg-[url('/img/superposition/bg-card.gif')] bg-repeat",
      title: "text-white",
    },
  };
  
  const solanaTheme = {
    icon: "/img/solana/icon.svg",
    card: {
      className: "bg-gradient-to-t from-[#1A1622] to-[#121212]",
      title: "text-white",
    },
  };
  
  const eclipseTheme = {
    icon: "/img/eclipse/icon.svg",
    card: {
      className: "bg-[#A0FDA0]",
      title: "text-black",
    },
  };
  
  const trumpchainTheme = {
    icon: "/img/trumpchain/icon.svg",
    card: {
      className: "bg-[#101054]",
      title: "text-white",
    },
  };
  
  const bitlayerTheme = {
    icon: "/img/bitlayer/icon.svg",
    card: {
      className: "bg-[#E36E1B]",
      title: "text-white",
    },
  };
  
  const automataTheme = {
    icon: "/img/automata/icon.svg",
    card: {
      className: "bg-[url('/img/automata/bg-card.svg')] bg-cover",
      title: "text-white",
    },
  };
  
  const hashkeyTheme = {
    icon: "/img/hashkey/icon.svg",
    card: {
      className: "bg-white",
      title: "text-black",
    },
  };
  
  const hyperevmTheme = {
    icon: "/img/hyperevm/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#042C24] to-[#031D1A]",
      title: "text-white",
    },
  };
  
  const monadTheme = {
    icon: "/img/monad/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#201A3A] to-[#06050B]",
      title: "text-white",
    },
  };
  
  const evmosTheme = {
    icon: "/img/evmos/icon.svg",
    card: {
      className: "bg-[#050008]",
      overlay: {
        className: "bg-[url('/img/evmos/bg-card.jpg')] bg-cover opacity-60",
      },
      title: "text-white",
    },
  };
  
  const sonicSvmTheme = {
    icon: "/img/sonic-svm/icon.svg",
    card: {
      className: "bg-[#0000FF]",
      title: "text-white",
    },
  };
  
  const settlusTheme = {
    icon: "/img/settlus/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#E1FEAE] via-[#D2F6C5] to-[#C0EBE9]",
      title: "text-[#002D2B]",
    },
  };
  
  const kaiaTheme = {
    icon: "/img/kaia/icon.svg",
    card: {
      className: "bg-[#040404]",
      title: "text-white",
    },
  };
  
  const roninTheme = {
    icon: "/img/ronin/icon.png",
    card: {
      className: "bg-[#111417]",
      title: "text-white",
    },
  };
  
  const morph2Theme = {
    icon: "/img/morph2/icon.svg",
    card: {
      className: "bg-[#B5FC82]",
      title: "text-black",
    },
  };
  
  const tronTheme = {
    icon: "/img/tron/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#ED0A28] to-[#3A0E08]",
      title: "text-white",
    },
  };
  
  const cornTheme = {
    icon: "/img/corn/icon.svg",
    card: {
      className: "bg-[#F7931A]",
      title: "text-white",
      overlay: {
        className:
          "bg-[url('/img/corn/bg-card.svg')] bg-cover opacity-[0.02] z-50 hover:animate-bg-corn hover:opacity-5",
      },
    },
  };
  
  const hemiTheme = {
    icon: "/img/hemi/icon.svg",
    card: {
      className: "bg-[#FFEBD4]",
      title: "text-black",
    },
  };
  
  const b3Theme = {
    icon: "/img/b3/icon.svg",
    card: {
      className: "bg-[#3368EF]",
      title: "text-white",
    },
  };
  
  const hychainTheme = {
    icon: "/img/hychain/icon.svg",
    card: {
      className: "bg-gradient-to-bl from-[#FFB26A] via-[#F66AFF] to-[#7D4AD1]",
      title: "text-black",
    },
  };
  
  const cotiTheme = {
    icon: "/img/coti/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#011C4F] to-[#0397BD]",
  
      title: "text-white",
    },
  };
  
  const miracleTheme = {
    icon: "/img/miracle/icon.svg",
    card: {
      className: "bg-gradient-to-b from-[#243144] to-[#152031]",
      title: "text-white",
    },
  };
  
  const subtensorTheme = {
    icon: "/img/subtensor/icon.svg",
    card: {
      className: "bg-white",
      title: "text-black",
    },
  };
  
  export const cardThemes: {
    [chainId: string]: { card: CardTheme; icon: string } | undefined;
  } = {
    [base.id]: baseTheme,
    [baseSepolia.id]: baseTheme,
    [optimism.id]: optimismTheme,
    [optimismSepolia.id]: optimismTheme,
    [arbitrum.id]: arbitrumOneTheme,
    [arbitrumSepolia.id]: arbitrumOneTheme,
    [mode.id]: modeTheme,
    [modeTestnet.id]: modeTheme,
    [fraxtal.id]: fraxTheme,
    [fraxtalTestnet.id]: fraxTheme,
    [blast.id]: blastTheme,
    [linea.id]: lineaTheme,
    [bsc.id]: bscTheme,
    [bscTestnet.id]: bscTheme,
    [88]: victionTheme,
    [inEVM.id]: injectiveTheme,
    [ancient8.id]: ancient8Theme,
    [ancient8Sepolia.id]: ancient8Theme,
    [mainnet.id]: ethereumTheme,
    [sepolia.id]: ethereumTheme,
    [holesky.id]: ethereumTheme,
    [polygon.id]: polygonTheme,
    [polygonAmoy.id]: polygonAmoyTheme,
    [avalanche.id]: avalancheTheme,
    [avalancheFuji.id]: avalancheTheme,
    [scroll.id]: scrollTheme,
    [185]: mintTheme,
    [1687]: mintTheme,
    [mintSepoliaTestnet.id]: mintTheme,
    [8866]: lumioTheme,
    [2702128]: xterioTheme,
    [metalL2.id]: metalTheme,
    [1740]: metalTheme,
    [shapeSepolia.id]: shapeTheme,
    [zora.id]: zoraTheme,
    [zoraSepolia.id]: zoraTheme,
    [pgn.id]: pgnTheme,
    [pgnTestnet.id]: pgnTheme,
    [redstone.id]: redstoneTheme,
    [17069]: redstoneTheme,
    [lyra.id]: deriveTheme,
    [lisk.id]: liskTheme,
    [liskSepolia.id]: liskTheme,
    [291]: orderlyTheme,
    [4460]: orderlyTheme,
    [cyber.id]: cyberTheme,
    [cyberTestnet.id]: cyberTheme,
    [celo.id]: celoTheme,
    [celoAlfajores.id]: celoTheme,
    [62320]: celoTheme,
    [48900]: zircuitTheme,
    [zircuitTestnet.id]: zircuitTheme,
    [swan.id]: swanTheme,
    [swanSaturnTestnet.id]: swanTheme,
    [swanProximaTestnet.id]: swanTheme,
    [snax.id]: snaxTheme,
    [snaxTestnet.id]: snaxTheme,
    [6805]: raceTheme,
    [6806]: raceTheme,
    [666666666]: degenTheme,
    [122]: fuseTheme,
    [100]: gnosisTheme,
    [255]: kromaTheme,
    [42]: luksoTheme,
    [5000]: mantleTheme,
    [4200]: merlinTheme,
    [1088]: metisTheme,
    [1284]: moonbeamTheme,
    [1101]: polygonZkEvmTheme,
    [111188]: realTheme,
    [1329]: seiTheme,
    [167000]: taikoTheme,
    [660279]: xiaTheme,
    [196]: xlayerTheme,
    [7000]: zetaTheme,
    [70700]: proofofplayTheme,
    [1996]: sankoTheme,
    [480]: worldchainTheme,
    [648]: enduranceTheme,
    [383353]: cheesechainTheme,
    [360]: moltenTheme,
    [169]: mantaTheme,
    [bob.id]: bobTheme,
    [bobSepolia.id]: bobTheme,
    [132902]: formTheme,
    [478]: formTheme,
    [325000]: campTheme,
    [5115]: citreaTheme,
    [33626250]: suaveTheme,
    [1946]: soneiumTheme,
    [1868]: soneiumTheme,
    [80084]: beraBartioTheme,
    [80094]: berachainTheme,
    [berachainBepolia.id]: berachainTheme,
    [984122]: formaTheme,
    [130]: unichainTheme,
    [1301]: unichainTheme,
    [763373]: inkTheme,
    [57073]: inkTheme,
    [9897]: arenaZTheme,
    [7897]: arenaZTheme,
    [6321]: auraTheme,
    [994873017]: lumiaTheme,
    [3441006]: mantaTheme,
    [1513]: storyTheme,
    [1514]: storyTheme,
    [1516]: storyTheme,
    [5845]: tangleTheme,
    [3799]: tangleTheme,
    [911867]: odysseyTheme,
    [52085143]: ethenaTheme,
    [324]: zkEraTheme,
    [2222]: kavaTheme,
    [33139]: apeChainTheme,
    [1625]: gravityTheme,
    [flowTestnet.id]: flowTheme,
    [flowMainnet.id]: flowTheme,
    [4801]: worldchainTheme,
    [19424]: alloTheme,
    [28882]: bobaTheme,
    [288]: bobaTheme,
    [42019]: donatuzTheme,
    [42026]: donatuzTheme,
    [233]: ethernityTheme,
    [183]: ethernityTheme,
    [3397901]: funkiTheme,
    [33979]: funkiTheme,
    [10888]: gameswiftTheme,
    [80008]: polynominalTheme,
    [8008]: polynominalTheme,
    [625]: bnryTheme,
    [53302]: superseedTheme,
    [5330]: superseedTheme,
    [204]: opbnbTheme,
    [1313161554]: auroraTheme,
    [1313161555]: auroraTheme,
    [250]: fantomTheme,
    [4002]: fantomTheme,
    [1116]: coreTheme,
    [543210]: zeroTheme,
    [592]: astarTheme,
    [3776]: astarZkTheme,
    [11124]: abstractTheme,
    [3888]: kalychainTheme,
    [1285]: moonriverTheme,
    [66665]: creatorTheme,
    [98865]: plumeTheme,
    [98866]: plumeTheme,
    [1923]: swellTheme,
    [1924]: swellTheme,
    [42793]: EtherlinkTheme,
    [14]: flareTheme,
    [8822]: iotaTheme,
    [40]: telosTheme,
    [41]: telosTheme,
    [3338]: peaqTheme,
    [1890]: lightlinkTheme,
    [223]: b2Theme,
    [146]: sonicTheme,
    [57054]: sonicTheme,
    [64165]: sonicTheme,
    [98985]: superpositionTheme,
    [55244]: superpositionTheme,
    [30168]: solanaTheme,
    [40168]: solanaTheme,
    [1408864445]: eclipseTheme,
    [4547]: trumpchainTheme,
    [900]: ethereumTheme,
    [901]: optimismTheme,
    [902]: baseTheme,
    [42170]: arbitrumNovaTheme,
    [200901]: bitlayerTheme,
    [177]: hashkeyTheme,
    [65536]: automataTheme,
    [999]: hyperevmTheme,
    [9001]: evmosTheme,
    [10143]: monadTheme,
    [507150715]: sonicSvmTheme,
    [5371]: settlusTheme,
    [5373]: settlusTheme,
    [8217]: kaiaTheme,
    [2020]: roninTheme,
    [2741]: abstractTheme,
    [2818]: morph2Theme,
    [728126428]: tronTheme,
    [5112]: hamTheme,
    [21000000]: cornTheme,
    [43111]: hemiTheme,
    [8333]: b3Theme,
    [2911]: hychainTheme,
    [2632500]: cotiTheme,
    [92278]: miracleTheme,
    [80888]: onyxTheme,
    [964]: subtensorTheme,
    [31911]: ozeanPoseidonTheme,
  };
  