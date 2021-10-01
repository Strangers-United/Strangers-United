const TokenBalanceChecker = artifacts.require("TokenBalanceChecker");

module.exports = async function (deployer) {
    // Deploy EthSwap
    await deployer.deploy(TokenBalanceChecker);
    const tokenBalanceChecker = await TokenBalanceChecker.deployed();
};
