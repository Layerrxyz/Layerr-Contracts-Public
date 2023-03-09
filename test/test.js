const LayerrFactory = artifacts.require("LayerrFactory");
const Layerr1155 = artifacts.require("./Layerr1155.sol");
const Layerr721 = artifacts.require("./Layerr721.sol");
const LayerrVariables = artifacts.require("./LayerrVariables.sol");
const Web3 = require("web3");

var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3.eth.getAccounts().then(console.log);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/*
 * To run the tests you must be running ganache-cli locally.
 * https://www.npmjs.com/package/ganache-cli
 */
contract("LayerrFactory", function (accounts) {
  it("happy path", async function () {
    const contractFactory = await LayerrFactory.deployed();
    const contract1155 = await Layerr1155.deployed();
    const contract721 = await Layerr721.deployed();
    const contractVariables = await LayerrVariables.deployed();

    await contractFactory.setLayerrXYZ(contractVariables.address, {
      from: accounts[0],
    });
    await contractFactory.setImplementation(contract1155.address, 1155, {
      from: accounts[0],
    });
    await contractFactory.setImplementation(contract721.address, 721, {
      from: accounts[0],
    });

    await contractVariables.setWithdraw(accounts[0], {
      from: accounts[0],
    });

    await contractVariables.setFee(5, {
      from: accounts[0],
    });

    await contractVariables.setFlatFee(640000000000000, {
      from: accounts[0],
    });

    console.log("getting here");

    await contractFactory._clone1155(
      "test",
      "test",
      "FAKE_URI",
      1000,
      accounts[1],
      "FAKE_ID",
      false,
      {
        from: accounts[1],
      }
    );

    const contractAddress = await contractFactory.projectIdToAddress("FAKE_ID");
    console.log("contractAddress", contractAddress);

    await contractVariables.setSpecificFee(contractAddress, 0, {
      from: accounts[0],
    });

    const specificFee = await contractVariables.viewFee(contractAddress);
    console.log("specificFee", specificFee.toNumber());

    const Layerr1155Clone = new web3.eth.Contract(
      Layerr1155.abi,
      contractAddress
    );

    // Call a function on the contract
    const name = await Layerr1155Clone.methods.name().call();
    console.log("Name of the cloned contract:", name);

    await Layerr1155Clone.methods
      .editContract(accounts[2], 1000, "baboo", "symbol")
      .send({ from: accounts[1] });

    const name1 = await Layerr1155Clone.methods.name().call();
    console.log("Name of the cloned contract:", name1);

    await Layerr1155Clone.methods
      .addToken(
        0,
        "FAKE_URI",
        1000000000000000,
        0,
        1708606800,
        100,
        22,
        [],
        [],
        false,
        [],
        []
      )
      .send({ from: accounts[1], gas: 5000000 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    await Layerr1155Clone.methods
      .modifySalePeriod(0, 1608606800, 1808606800)
      .send({ from: accounts[1] })
      .then((receipt) => {})
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    const price = await Layerr1155Clone.methods.tokenPrices(0).call();
    console.log("price of the cloned contract:", price);

    let balance = await web3.eth.getBalance(accounts[0]);
    let balance2 = await web3.eth.getBalance(accounts[1]);

    let totalprice = 1000000000000000 + 640000000000000;

    await Layerr1155Clone.methods
      .mint(0, 1)
      .send({ from: accounts[2], gas: 5000000, value: totalprice * 1 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    let balance3 = await web3.eth.getBalance(accounts[0]);
    let balance4 = await web3.eth.getBalance(accounts[1]);
    let difference = balance4 - balance2;
    let difference2 = balance3 - balance;
    console.log("difference for account 1", difference);
    console.log("difference for account 0", difference2);

    await Layerr1155Clone.methods
      .addToken(
        1,
        "FAKE_URI",
        2000000000000000,
        0,
        1708606800,
        100,
        22,
        [],
        [],
        false,
        [],
        []
      )
      .send({ from: accounts[1], gas: 5000000 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    totalprice = 2000000000000000 + 1000000000000000 + 640000000000000 * 2;
    await Layerr1155Clone.methods
      .batchMint([0, 1], [2, 2])
      .send({ from: accounts[2], gas: 5000000, value: totalprice * 2 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    await Layerr1155Clone.methods
      .addToken(
        2,
        "FAKE_URI",
        3000000000000000,
        0,
        1708606800,
        100,
        22,
        [],
        [],
        false,
        [],
        []
      )
      .send({ from: accounts[1], gas: 5000000 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    totalprice =
      3000000000000000 +
      2000000000000000 +
      1000000000000000 +
      640000000000000 * 3;
    await Layerr1155Clone.methods
      .batchMint([0, 1, 2], [2, 2, 2])
      .send({ from: accounts[2], gas: 5000000, value: totalprice * 2 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    await contractFactory._clone721(
      "test",
      "test",
      "FAKE_URI",
      1000,
      accounts[1],
      "FAKE_ID2",
      false,
      {
        from: accounts[1],
      }
    );

    const contractAddress721 = await contractFactory.projectIdToAddress(
      "FAKE_ID2"
    );
    console.log("contractAddress", contractAddress721);

    await contractVariables.setSpecificFee(contractAddress721, 10, {
      from: accounts[0],
    });

    const Layerr721Clone = new web3.eth.Contract(
      Layerr721.abi,
      contractAddress721
    );

    const name2 = await Layerr721Clone.methods.name().call();
    console.log("Name of the cloned contract:", name2);

    await Layerr721Clone.methods
      .addToken(0, "FAKE_URI", 1000000000000000, 0, 1708606800)
      .send({ from: accounts[1], gas: 5000000 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    balance = await web3.eth.getBalance(accounts[0]);
    balance2 = await web3.eth.getBalance(accounts[1]);

    await Layerr721Clone.methods
      .mintFixedPrice(0)
      .send({ from: accounts[2], gas: 5000000, value: 1640000000000000 })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .catch((error) => {
        console.error("Transaction error:", error);
      });

    balance3 = await web3.eth.getBalance(accounts[0]);
    balance4 = await web3.eth.getBalance(accounts[1]);
    difference = balance4 - balance2;
    difference2 = balance3 - balance;
    console.log("difference for account 1", difference);
    console.log("difference for account 0", difference2);
  });
});

async function assertFailure(promise, reason) {
  let failed = false;
  try {
    await promise;
  } catch (err) {
    failed = true;
    if (reason) {
      assert.equal(err.reason, reason);
    }
  }
  assert.equal(failed, true);
}
