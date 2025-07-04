# ZE | RO
### RWA Tokenization Platform using proof system for execution verification

> **Transforming real-world asset auctions with zero-knowledge proofs and blockchain for ultimate privacy, security, and transparency**

![Zero 2.0](https://img.shields.io/badge/Zero-2.0-blue?style=for-the-badge&logo=rust)
![RISC0](https://img.shields.io/badge/RISC0-zkVM-green?style=for-the-badge)
![Rust](https://img.shields.io/badge/Rust-1.70+-orange?style=for-the-badge&logo=rust)
![NextJS](https://img.shields.io/badge/NextJS-15.3+-black?style=for-the-badge&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)

<img width="1840" alt="Screenshot 2025-06-29 at 10 26 40 PM" src="https://github.com/user-attachments/assets/9863604a-7c02-4f6a-9b15-5cbb50d04ba2" />

## 🚗 What is Zero?

ZERO is the next-generation decentralized car auction platform, built on blockchain and zero-knowledge technology. By incorporating zero-knowledge proofs (RISC Zero zkVM), the platform ensures secure execution across both off-chain and on-chain systems.

### The Problem ZERO Solves

Representing real-world assets (RWAs) on-chain is a major unsolved challenge. ZERO provides a way to verify and represent assets on-chain by proving off-chain executions, such as proof of state. The main problem we solve is ensuring security and trust in off-chain systems, leading to trusted execution and verification on-chain.

ZERO enables:

- **Private, verifiable car auctions**
- **On-chain representation of off-chain assets and actions**
- **Trustless proof of ownership, entry, and execution**
- **End-to-end privacy and data integrity**

## 🏗️ Project Structure

The system is composed of multiple core components, each playing a critical role in making the platform both efficient and secure:

```
/frontend   - NextJS frontend for user experience
/zk         - Zero-knowledge virtual machine (zkVM) logic and proof generation
/contract   - Smart contracts for proof verification and asset minting
```

- **Frontend**: Seamless user experience for auctions and asset management
- **zkVM**: Cryptographic proof generation and off-chain execution verification
- **Smart Contracts**: On-chain proof verification, asset minting, and auction logic

## 🔑 Key Innovations & Components

- **ZK + CCIP Integration**: ZERO integrates zero-knowledge proofs and Chainlink CCIP for proof generation and state sync across multiple chains. The zkVM performs cryptographic operations off-chain, while on-chain verification ensures real-time trust and transparency.
- **Merkle Tree-Based Proofs**: All car data is hashed and validated using Merkle trees, guaranteeing that no data can be tampered with undetected. This validation occurs both on-chain and off-chain.
- **Privacy & Security**: Sensitive car data is always protected. Only relevant, non-sensitive data is exposed, while all other information remains private.
- **Proof Types**:
  - **Proof of State**: Verifies the current state of off-chain assets
  - **Proof of Entry**: Represents RWAs (cars) on the platform
  - **Proof of Ownership**: Verifies asset ownership
  - **Proof of Execution**: Verifies actions like bid, buy, sell, and auction

## 🛠️ Challenges & Solutions

- **State Verification**: Ensuring the off-chain database state matches the on-chain proof. ZERO uses zkVM to prove the execution of state checks, returning a verifiable status that anyone can independently verify.
- **Cross-Chain Sync & Replay Protection**: Cross-chain applications and NFTs must sync system state to prevent replay attacks. By leveraging CCIP and Chainlink Functions, our contracts can access off-chain state via custom API endpoints, which run zkVM state checks and return IPFS hashes of the data.

## 🧩 Proof of State & Asset Integrity

ZERO enables:

- **Proof of State**: Verifying the current state of an asset or auction
- **Proof of Entry**: Onboarding and representing a car as an RWA
- **Proof of Ownership**: Proving who owns what, without revealing sensitive details
- **Proof of Execution**: Verifying actions (bid, buy, sell) occurred as claimed

All proofs are cryptographically verifiable, ensuring transparency, privacy, and trust.

## 🏁 Getting Started with the ZERO Stack

To run the full ZERO 2.0 stack locally, follow these steps to configure your environment, run the backend (zkVM), and prepare your database and cache systems.

### 1. 🛠️ Clone the Repository

```bash
git clone https://github.com/nyuiela/zero-2.0
cd zero-2.0
```

### 2. Setup the Environment Variable

Setup your project by starting a postgresql and redis server.
Create a database for this project `zero`
Create a `.env` file in the `/zk` folder and add the the following details

```bash
DATABASE_URL=postgres://username:password@localhost:5432/zero_db
REDIS_URL=redis://127.0.0.1/
```

### 3. Running the zero server

Run the ZK and backend server to have access to it on port `3001`

Seed the database
```bash
cd zk
cargo run --bin db
```

Run the zk host in dev mode for faster proving
```bash
RISC0_DEV_MODE=1 RUST_LOG=info RISC0_INFO=1 cargo run -p host
```

### 4. Running the frontend

Change directory back to the `/frontend` folder and run your the frontend on port `3000` using this command

```bash
pnpm install
pnpm dev
```
## Contract Address on Base Sepolia
```bash
PERMISSION_MANAGER_ADDRESS= 0xf967a09973223A1b042961eAd36C7aC6396c0F4a
BRAND_PERMISSION_MANAGER_ADDRESS= 0x25d6F7DFC81472279B1e1aBFd9a8081132C4C158
CAR_ORACLE_ADDRESS= 0xF821A42A2aF55E400AEdb50923197818b17eAfB3
ORACLE_MASTER_ADDRESS= 0x7F97e93f95E514819c722e78Fdd360f22Aca7b25
PROFILE_ADDRESS= 0xd910FfFEe925F5504Ab3bC21184D9e544F803979
STATEMANAGER_ADDRESS= 0xE216C5b72A529e7207721F386a43b3822C2843fC
INITFUNCTION_ADDRESS= 0xE2766BB943D16671621F98eeb354B5536e95d914
MERKLEVERIFIER_ADDRESS= 0xb34854192F06d29e0C5Cfbc24b0B23d84b6AE977
PROOFSYNC_ADDRESS= 0xed1923afba58d0d12836b512FeFdb27Dd627B04c
CROSS_TOKEN_ADDRESS= 0x5777C6C07d9C5EFF74dc50082cfdf77Cf18C396d
SYNCFUNCTION_ADDRESS= 0x77790A3c6DF62D897F3aFf27D9A187681940A8b2
FEE= 0x6022982bDcF88A1E9ea33F358901EaCDFEb9c11f
REPUTATION_ADDRESS= 0xd5362033f7133B5D0865da0361A3B71E9ceD9F6f
CAR_REGISTRY_ADDRESS= 0x4bD333f77cc2f583BC237B1095B2aA6942D8d242
ZERO_NFT_ADDRESS= 0xF4d2a2245CB595Da6FCfCB882761b9bBDCE74C47
AUCTION_ADDRESS= 0xeD97941795956c7C8E208616E6c695A73420979b
STATECHECKFUNCTION_ADDRESS= 0x1FDb6BFf2412e2326be4c7713626d5184e1E4531
MESSENGER_ADDRESS= 0x9aD9033aD8DE962E841FfA9921362A461B6aAa07
```
## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Areas of Interest

- Zero-knowledge proof optimization
- Smart contract development
- Frontend user experience
- Backend performance improvements
- Security auditing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

- **Technical Documentation**: [zk/README.md](zk/README.md)
- **API Reference**: [zk/API_DOCUMENTATION.md](zk/API_DOCUMENTATION.md)
- **Development Guide**: [zk/LOCAL_DEVELOPMENT.md](zk/LOCAL_DEVELOPMENT.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🎯 Roadmap

- [ ] **Q2 2025**: Enhanced zk-proof generation and optimization
- [ ] **Q3 2025**: Multi-chain support (Polygon, Arbitrum, Base)
- [ ] **Q4 2025**: Advanced auction types (Dutch, English, Vickrey)

## 🏁 Conclusion

ZERO is not just a car auction platform—it's a transformative leap forward in how real-world assets are represented and traded in a decentralized world. By using zero-knowledge proofs, the platform ensures that each auction is transparent, verifiable, and secure, while maintaining privacy for all parties involved. With a user-friendly frontend, advanced backend architecture, and a strong commitment to security, ZERO 2.0 is poised to become the go-to solution for blockchain-based car auctions.

---

**Zero 2.0 - Where Privacy Meets Transparency in Car Auctions**

_Built with ❤️ using cutting-edge zero-knowledge technology_
