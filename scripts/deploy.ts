import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const BatchSender = await ethers.getContractFactory("BatchSender");
  const TestERC20 = await ethers.getContractFactory("TestERC20");
  const batchSender = await BatchSender.deploy();
  const testERC20 = await TestERC20.deploy(BigNumber.from(10).pow(35));

  await testERC20.deployed();
  await batchSender.deployed();

  console.log(`batchSender: ${batchSender.address}`);
  console.log(`testERC20: ${testERC20.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
