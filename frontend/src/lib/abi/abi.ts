import auction from "./auction.sol/Auction.json"
import car_oracle from "./CarOracle.sol/CarOracle.json"
import ccip from "./ccip.sol/CrossToken.json"
// import fee from "./auction.sol/Auction.json"
import profile from "./profile.sol/Profile.json"
import merkleVerifier from "./merkle_verifier.sol/MerkleVerifier.json"
import messenging from "./messenging.sol/Messenger.json"
import registry from "./registry.sol/CarRegistry.json"
import reputation from "./reputation.sol/Reputation.json"
import state from "./State.sol/StateManager.json"
import sync from "./sync_function.sol/Sync.json"
import proofSync from "./proofSync.sol/ProofSync.json"
import oracleMaster from "./Oracle.sol/OracleMaster.json"
import zeroNft from "./ZeroNFT.sol/ZeroNFT.json"
// import initFn from "./proofSync.sol/ProofSync.json"


// address 
// NEXT_PUBLIC_InitFunction
export const oracleMaster_addr = process.env.NEXT_PUBLIC_OracleMaster
export const proofSync_addr = process.env.NEXT_PUBLIC_ProofSync
export const zero_addr = process.env.NEXT_PUBLIC_ZeroNFT


// NEXT_PUBLIC_Fee

export const sync_addr = process.env.NEXT_PUBLIC_SyncFunction
export const state_addr = process.env.NEXT_PUBLIC_StateManager
export const reputation_addr = process.env.NEXT_PUBLIC_Reputation
export const registry_addr = process.env.NEXT_PUBLIC_CarRegistry as `0x${string}`
export const messenging_addr = process.env.NEXT_PUBLIC_MESSENGING
export const merkle_addr = process.env.NEXT_PUBLIC_MerkleVerifier
export const profile_addr = process.env.NEXT_PUBLIC_Profile
export const ccip_addr = process.env.NEXT_PUBLIC_CrossToken
export const car_oracle_addr = process.env.NEXT_PUBLIC_CarOracle
export const auction_addr = process.env.NEXT_PUBLIC_Auction


export const sync_abi = sync.abi;
export const state_abi = state.abi;
export const reputation_abi = reputation.abi;
export const registry_abi = registry;
export const messenging_abi = messenging.abi;
export const merkle_abi = merkleVerifier.abi;
export const profile_abi = profile.abi;
export const ccip_abi = ccip.abi;
export const car_oracle_abi = car_oracle.abi;
export const auction_abi = auction.abi;
export const oracleMaster_abi = oracleMaster.abi
export const proofSync_abi = proofSync.abi
export const zero_abi = zeroNft.abi
