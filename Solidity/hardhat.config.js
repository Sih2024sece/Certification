require("@nomicfoundation/hardhat-toolbox");


const { vars } = require("hardhat/config");
// const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/34595ba8d5054540908cf0ed72b6d25b`,
      accounts: ["2b3ad6396415696369a9b2a77981e9d85645f7b0504361a5cb22a2178e3543a1"],
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: ["0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"],
    },
  },
};

// require('@nomicfoundation/hardhat-toolbox');
// require('dotenv').config();

// module.exports = {
//   solidity: {
//     version: '0.8.23',
//   },
//   networks: {
//     // for mainnet
//     // 'base-mainnet': {
//     //   url: 'https://mainnet.base.org',
//     //   accounts: [process.env.WALLET_KEY],
//     //   gasPrice: 1000000000,
//     // },
//     // for testnet
//     'sepolia': {
//       url: 'https://sepolia.base.org',
//       accounts: ["0x743423B0aFa89619c29082f5d2f36E9317cb63fa"],
//       gasPrice: 1000000000,
//     },
//     // for local dev environment
//     // localhost: {
//     //   url: 'http://localhost:8545',
//     //   accounts: ["0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e","0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd"],
//     // },
//   },
//   defaultNetwork: 'hardhat',
// };
