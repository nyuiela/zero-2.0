// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UsdcToken is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Mint 1,000,000 USDC to deployer
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function _approve(address contract_, uint256 amount) external {
        approve(contract_, amount);
    }
}
