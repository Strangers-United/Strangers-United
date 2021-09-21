const Adoption = artifacts.require("./Adoption.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Adoption", (accounts) => {
    let contract;

    before(async () => {
        contract = await Adoption.deployed();
    });

    describe("deployment", async () => {
        it("deploys successfully", async () => {
            const address = contract.address;
            assert.notEqual(address, "");
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });
});
