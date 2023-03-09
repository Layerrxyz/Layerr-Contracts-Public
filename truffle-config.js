var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "WALLET_PRIVATE_KEY";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "https://goerli.infura.io/v3/INFURA_API_KEY"
        );
      },
      network_id: 5,
    },
    mumbai: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "https://polygon-mumbai.g.alchemy.com/v2/ALCHEMY_API_KEY"
        );
      },
      network_id: 80001,
      gas: 6500000,
      confirmations: 2,
      timeoutBlocks: 200,
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "https://mainnet.infura.io/v3/INFURA_API_KEY"
        );
      },
      network_id: 1,
      gas: 6500000,
      gasPrice: 24000000000,
      networkCheckTimeout: 100000,
    },
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: "ETHERSCAN_API_KEY",
    polygonscan: "POLYGONSCAN_API_KEY",
  },
  compilers: {
    solc: {
      // deployed via remix with 0.8.7+commite28d00a7
      version: "0.8.13",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1500,
        },
      },
    },
  },
};
