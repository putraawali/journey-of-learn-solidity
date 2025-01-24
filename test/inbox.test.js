const assert = require("assert");
const { Web3 } = require("web3");
const ganache = require("ganache"); // Local test network
const compiledInbox = require("../compile.js");
const byteCode = compiledInbox.evm.bytecode.object;
const abi = compiledInbox.abi; // ABI (application binary interface)

const web3 = new Web3(ganache.provider());

let account;
let inbox;

beforeEach(async () => {
    // Get list of all accounts
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    // Deploy the contract
    const contractDeployer = new web3.eth.Contract(abi).deploy({
        data: "0x0" + byteCode,
        arguments: ["Hi there!"],
    });

    inbox = await contractDeployer
        .send({
            from: account,
            gas: "3000000",
        })
        .on("error", (err) => {
            console.log(err, "<<<<");
        });
});

describe("Verify contract", () => {
    it("deploys a contract", () => {
        assert.ok(inbox.options.address, "contract not deployed yet!");
    });

    it("verify initial message", async () => {
        let message = await inbox.methods.message().call();
        console.log(message);
    });
});
