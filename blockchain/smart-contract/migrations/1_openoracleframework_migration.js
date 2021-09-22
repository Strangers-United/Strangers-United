const openOracleFramework = artifacts.require("OpenOracleFramework");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(openOracleFramework);
};