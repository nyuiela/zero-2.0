## Euler Protocol implementation On ZERO Plan and structure

## structure

**Has two core features**

- a smart contract that executes flash loan arbitrage to help users reach a target amount of tokens (WETH or USDC) for auction bidding.
  
- a smart contract that allows ZeroNFT holders to lock their nft and use it at collateral to borrow on the eular protocol.note: the zero nft is locked on the zero protocol. Usr gets their disered collateral by creating a request(if that reques is appreoved by a fulfiller), the amount is then deposited on theular protocol and borrowed aginst to get users amount.
 **hhow does the repay work**
 # there are 2 repay parties involed ( the eular protol and the fufilller)
 - repay(fulfiller) : when the repay period has passed and the user has still not repaid, the fulfiller has 100% righ to liquidate them. workflow . fulfiller -- liquidate -- repay(eular) -- liquidate and claim the users nft
  
  if the user is able to repay

 - repay - user repays fulfiler  ---> we use the collateral on eular to repay most of the debt we can , probabity that it wont be enough will be high due to interest. meaning the user will have to pay all!



additional feature -- when brands stake -- funds will be deposited into yield vaults to generate yield

// Example: WETH → USDC → WETH arbitrage

1. Borrow WETH from vault
2. Swap WETH → USDC (using Euler Swap)
3. Swap USDC → WETH (using Euler Swap)
4. Repay WETH to vault
5. Keep profit in target token
