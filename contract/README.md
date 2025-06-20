## Foundry

remappings = [
"@chainlink/contracts/=lib/chainlink/contracts/src/v0.8/",
"@chainlink/contracts-ccip/=lib/chainlink/contracts/src/v0.8/ccip/",
"@openzeppelin/=lib/chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/",
"chainlink-brownie-contracts/=lib/foundry-chainlink-toolkit/lib/chainlink-brownie-contracts/contracts/src/v0.6/vendor/@arbitrum/nitro-contracts/src/",
"ds-test/=lib/foundry-chainlink-toolkit/lib/forge-std/lib/ds-test/src/",
"forge-std/=lib/forge-std/src/",
"foundry-chainlink-toolkit/=lib/foundry-chainlink-toolkit/",
"openzeppelin-contracts/=lib/foundry-chainlink-toolkit/lib/openzeppelin-contracts/",

]
**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
