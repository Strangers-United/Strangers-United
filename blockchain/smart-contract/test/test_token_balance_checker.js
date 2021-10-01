const TokenBalanceChecker = artifacts.require("TokenBalanceChecker");

// import * as chain from "chai";

contract("TokenBalanceChecker", (accounts) => {
    let contract;

    describe("deployment", async () => {
        it("deployed successfully", async () => {
            contract = await TokenBalanceChecker.deployed();
            const address = contract.address;
            assert.notEqual(address, "");
        });
    });
});
