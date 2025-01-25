const assert = require("assert");
const ganache = require("ganache"); // Local test network
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../compile");

let accounts;
let inbox;

beforeEach(async () => {
    // Get list of all accounts
    accounts = await web3.eth.getAccounts();
    // Deploy the contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: ["Hi there!"],
        })
        .send({ from: accounts[0], gas: "1000000" });
});

describe("Verify contract", () => {
    it("deploys a contract", () => {
        assert.ok(inbox.options.address, "contract not deployed yet!");
    });

    it("verify initial message", async () => {
        let message = await inbox.methods.message().call();
        assert.equal(message, "Hi there!");
    });

    it("verify setMessage method", async () => {
        await inbox.methods.setMessage("Hi bro!").send({ from: accounts[0] });
        let message = await inbox.methods.message().call();
        assert.equal(message, "Hi bro!");
    });
});
