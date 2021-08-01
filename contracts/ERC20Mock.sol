pragma solidity ^0.8.0;

import "./Token.sol";

// mock class using ERC20
contract ERC20Mock is Token {
    constructor(
        string memory name,
        string memory symbol,
        address initialAccount,
        uint256 initialBalance
    ) payable Token(name, symbol, initialAccount) {
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function transferInternal(
        address from,
        address to,
        uint256 value
    ) public {
        transfer(to, value);
    }

    function approveInternal(
        address owner,
        address spender,
        uint256 value
    ) public {
        approve(spender, value);
    }
}
