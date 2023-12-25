require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const SCAN_API_KEY = process.env.SCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{
      version: "0.8.20",
      },
      {
        version: "0.4.22",
        settings: {},
      },
    ]
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
    },

    scroll_sepolia_testnet: {
      url: `https://sepolia-rpc.scroll.io/`,
      accounts: [`${PRIVATE_KEY}`],
    },
    bsct: {
      url: `https://endpoints.omniatech.io/v1/bsc/testnet/public`,
      accounts: [`${PRIVATE_KEY}`],
    },
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [`${PRIVATE_KEY}`],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
    },
    linea_testnet: {
      url: `https://rpc.goerli.linea.build`,
      accounts: [`${PRIVATE_KEY}`],
    },
    sepolia: {
      url: `https://ethereum-sepolia.publicnode.com`,
      accounts: [`${PRIVATE_KEY}`],
    },
    hardhat: {
      gas: 10000000000,
      blockGasLimit: 10000000000,
    },
  },

  etherscan: {
    apiKey: SCAN_API_KEY,
  },

  mocha: {
    timeout: 100000
  },
};
