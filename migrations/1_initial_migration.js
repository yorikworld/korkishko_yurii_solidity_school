const Migrations = artifacts.require("Migrations");
const Token = artifacts.require("Token");

module.exports = function (deployer) {
  deployer.deploy(Token, 'KorkishkoToken', 'KOR', '0x199Bf280Ea4f74035e2C2DE4395bfD13D13c3Ffc');
};
