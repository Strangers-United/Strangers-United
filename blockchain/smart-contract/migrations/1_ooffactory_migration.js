const oofFactory = artifacts.require("OOFFactory");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  const factoryOwner = "";
  const oofImplementation = "";
  const conjureRouter = "";
  await deployer.deploy(oofFactory, factoryOwner, oofImplementation, conjureRouter);
};