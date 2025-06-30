-include .env

.PHONY: all clean build test deploy help deploy-local deploy-eth deploy-sonic deploy-hedera deploy-avalanche deploy-base deploy-config anvil register-car

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

ifndef PRIVATE_KEY
$(warning PRIVATE_KEY is undefined. Please check your .env file)
endif

help:
	@echo "Usage:"
	@echo "  make deploy [ARGS=...]           - Deploy using BASE or local"
	@echo "  make deploy-base                 - Deploy to Base Sepolia"
	@echo "  make deploy-eth                  - Deploy to Ethereum Sepolia"
	@echo "  make deploy-sonic                - Deploy to Sonic Blaze"
	@echo "  make deploy-hedera               - Deploy to Hedera Previewnet"
	@echo "  make deploy-avalanche            - Deploy to Avalanche Fuji"
	@echo "  make deploy-config               - Deploy Contract Config Script"
	@echo "  make register-car                - Run interaction script to register car"
	@echo "  make test                        - Run tests"
	@echo "  make anvil                       - Launch local anvil node"

all: clean build

clean:
	forge clean

build:
	forge build

test:
	forge test

anvil:
	anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

NETWORK_ARGS := --rpc-url $(LOCALCHAIN_URL) --private-key $(DEFAULT_ANVIL_KEY) --broadcast

ifeq ($(findstring --network base,$(ARGS)),--network base)
	NETWORK_ARGS := --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
endif

ifeq ($(findstring --network eth,$(ARGS)),--network eth)
	NETWORK_ARGS := --rpc-url $(ETHEREUM_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
endif

ifeq ($(findstring --network sonic,$(ARGS)),--network sonic)
	NETWORK_ARGS := --rpc-url $(SONIC_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
endif

ifeq ($(findstring --network hedera,$(ARGS)),--network hedera)
	NETWORK_ARGS := --rpc-url $(HEDERA_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
endif

ifeq ($(findstring --network avalanche,$(ARGS)),--network avalanche)
	NETWORK_ARGS := --rpc-url $(AVALANCHE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
endif

deploy:
	@forge script script/Deploy.s.sol:DeployScript $(NETWORK_ARGS)

deploy-base:
	@forge script script/Deploy.s.sol:DeployScript --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-local:
	@forge script script/Deploy.s.sol:DeployScript --rpc-url $(LOCALCHAIN_URL) --private-key $(DEFAULT_ANVIL_KEY) --broadcast -vvvv

deploy-eth:
	@forge script script/Deployccip.s.sol:DeployCCIP --rpc-url $(ETHEREUM_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-sonic:
	@forge script script/Deploysonic.s.sol:DeployCCIP --rpc-url $(SONIC_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-hedera:
	@forge script script/Deployhedera.s.sol:DeployCCIP --rpc-url $(HEDERA_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-config:
	@forge script script/contractsconfig.s.sol:ContractConfig --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-avalanche:
	@forge script script/DeployAvalanche.s.sol:DeployCCIP --rpc-url $(AVALANCHE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

register-car:
	@forge script script/interaction.s.sol:ContractConfig --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvvv

deploy-sync:
	@forge script script/DeploySync.s.sol:DeployScript --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv