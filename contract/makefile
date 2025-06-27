 -include .env

.PHONY: all clean build test deploy help

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

help:
	@echo "Usage:"
	@echo "  make deploy [ARGS=...]           - Deploy using BASE or local"
	@echo "  make test                         - Run tests"
	@echo "  make anvil                        - Launch local anvil node"

all: clean build

clean: ; forge clean

build: ; forge build

test: ; forge test

anvil:
	anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

# Default to local
NETWORK_ARGS := --rpc-url $(LOCALCHAIN_URL) --private-key $(DEFAULT_ANVIL_KEY) --broadcast

#  deploying to Base Sepolia
ifeq ($(findstring --network base,$(ARGS)),--network base)
	NETWORK_ARGS := --rpc-url $(BASE_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
endif

deploy:
	@forge script script/Deploy.sol:DeployScript $(NETWORK_ARGS)
