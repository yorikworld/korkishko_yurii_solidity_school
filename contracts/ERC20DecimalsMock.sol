// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./Token.sol";

contract ERC20DecimalsMock is Token {
uint8 private _decimals;

constructor(
string memory name_,
string memory symbol_,
uint8 decimals_
) Token(name_, symbol_, 0x199Bf280Ea4f74035e2C2DE4395bfD13D13c3Ffc) {
_decimals = decimals_;
}

function decimals() public view virtual override returns (uint8) {
return _decimals;
}
}
