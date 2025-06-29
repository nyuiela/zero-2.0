-include .env

.PHONY: all clean build test deploy help deploy-local deploy-eth deploy-sonic deploy-hedera deploy-avalanche

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

help:
	@echo "Usage:"
	@echo "  make deploy [ARGS=...]           - Deploy using BASE or local"
	@echo "  make deploy-eth                  - Deploy to Ethereum Sepolia"
	@echo "  make deploy-sonic                - Deploy to Sonic Blaze"
	@echo "  make deploy-hedera               - Deploy to Hedera Previewnet"
	@echo "  make deploy-avalanche            - Deploy to Avalanche Fuji"
	@echo "  make test                        - Run tests"
	@echo "  make anvil                       - Launch local anvil node"

all: clean build

clean: ; forge clean

build: ; forge build

test: ; forge test

anvil:
	anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

# Default to local
NETWORK_ARGS := --rpc-url $(LOCALCHAIN_URL) --private-key $(DEFAULT_ANVIL_KEY) --broadcast

# deploying to Base Sepolia
ifeq ($(findstring --network base,$(ARGS)),--network base)
	NETWORK_ARGS := --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
endif

deploy:
	@forge script script/Deploy.s.sol:DeployScript $(NETWORK_ARGS)

deploy-base:
	@forge script script/Deploy.s.sol:DeployScript --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-local:
	@forge script script/Deploy.s.sol:DeployScript --rpc-url $(LOCALCHAIN_URL) --private-key $(DEFAULT_ANVIL_KEY) --broadcast -vvvv

deploy-eth:
	@forge script script/Deployccip.s.sol:DeployCCIP --rpc-url $(ETHERUM_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-sonic:
	@forge script script/Deploysonic.s.sol:DeployCCIP --rpc-url $(SONIC_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-hedera:
	@forge script script/Deployhedera.s.sol:DeployCCIP--rpc-url $(HEDERA_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv

deploy-avalanche:
	@forge script script/DeployAvalanche.s.sol:DeployCCIP --rpc-url $(AVALANCHE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
