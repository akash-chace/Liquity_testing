require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ganache");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY = "aa3e706e010da850bbde28699f3ed8a5b518bbaaed4b8c19fee5eb95f6fdd815";
// const ROPSTEN_PRIVATE_KEY = "74b9b7dbceb71bfbac8e36bbeb275fcb42b46719c80813a17694d970040ace6f";

module.exports = {
  solidity: {
    version: "0.6.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  networks: {
    ganache: {
      gasLimit: 6000000000,
      defaultBalanceEther: 10,
      url: `http://127.0.0.1:7545`
    },
    // hardhat: {
    //   forking:{
    //     // url: 'https://mainnet.infura.io/v3/4a0d4077ef524f1386e8e77d2d570026',
    //     url: 'https://eth-mainnet.alchemyapi.io/v2/M1zuIMqavOSaGUM7-bnOJoBxDJPIzr4f',
    //     blcokNumber : '13957983'
    //   }
    // },
    bsc: {
      url: `https://data-seed-prebsc-2-s3.binance.org:8545/`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    },
    kovan: {
      url: `https://kovan.infura.io/v3/4a0d4077ef524f1386e8e77d2d570026`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/8da4e8ba163546bfa8183bd408909fb5`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    },
    polygon:{
      url: `https://polygon-mainnet.infura.io/v3/8da4e8ba163546bfa8183bd408909fb5`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    },
  },
    
    
  etherscan: {
    apiKey :'CI84YQD1UZUJ7QJVYE8FNFH5TF5RVX6NF6' 
  },
};