import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_KEY || "",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.ankr.com/bsc",
      },
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: {
        mnemonic: process.env.NODE_ARRAY,
      },
    },
  },
};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default config;
