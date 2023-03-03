import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("BatchSender", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBatchSender() {
    const [owner, otherAccount] = await ethers.getSigners();
    const BatchSender = await ethers.getContractFactory("BatchSender");
    const TestERC20 = await ethers.getContractFactory("TestERC20");
    const batchSender = await BatchSender.deploy();
    const testERC20 = await TestERC20.deploy(BigNumber.from(10).pow(35));

    return { batchSender, testERC20, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("test batchTransfer", async function () {
      const { batchSender, testERC20, owner, otherAccount } = await loadFixture(
        deployBatchSender
      );
      await testERC20.approve(batchSender.address, BigNumber.from(10).pow(60));
      await batchSender
        .connect(owner)
        .batchTransfer(testERC20.address, [otherAccount.address], [10 ** 5]);

      expect(await testERC20.balanceOf(otherAccount.address)).to.equal(10 ** 5);
    });

    //   it("Should set the right owner", async function () {
    //     const { lock, owner } = await loadFixture(deployBatchSender);

    //     expect(await lock.owner()).to.equal(owner.address);
    //   });

    //   it("Should receive and store the funds to lock", async function () {
    //     const { lock, lockedAmount } = await loadFixture(
    //       deployBatchSender
    //     );

    //     expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //       lockedAmount
    //     );
    //   });

    //   it("Should fail if the unlockTime is not in the future", async function () {
    //     // We don't use the fixture here because we want a different deployment
    //     const latestTime = await time.latest();
    //     const Lock = await ethers.getContractFactory("Lock");
    //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //       "Unlock time should be in the future"
    //     );
    //   });
    // });

    // describe("Withdrawals", function () {
    //   describe("Validations", function () {
    //     it("Should revert with the right error if called too soon", async function () {
    //       const { lock } = await loadFixture(deployBatchSender);

    //       await expect(lock.withdraw()).to.be.revertedWith(
    //         "You can't withdraw yet"
    //       );
    //     });

    //     it("Should revert with the right error if called from another account", async function () {
    //       const { lock, unlockTime, otherAccount } = await loadFixture(
    //         deployBatchSender
    //       );

    //       // We can increase the time in Hardhat Network
    //       await time.increaseTo(unlockTime);

    //       // We use lock.connect() to send a transaction from another account
    //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //         "You aren't the owner"
    //       );
    //     });

    //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //       const { lock, unlockTime } = await loadFixture(
    //         deployBatchSender
    //       );

    //       // Transactions are sent using the first signer by default
    //       await time.increaseTo(unlockTime);

    //       await expect(lock.withdraw()).not.to.be.reverted;
    //     });
    //   });

    //   describe("Events", function () {
    //     it("Should emit an event on withdrawals", async function () {
    //       const { lock, unlockTime, lockedAmount } = await loadFixture(
    //         deployBatchSender
    //       );

    //       await time.increaseTo(unlockTime);

    //       await expect(lock.withdraw())
    //         .to.emit(lock, "Withdrawal")
    //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //     });
    //   });

    //   describe("Transfers", function () {
    //     it("Should transfer the funds to the owner", async function () {
    //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //         deployBatchSender
    //       );

    //       await time.increaseTo(unlockTime);

    //       await expect(lock.withdraw()).to.changeEtherBalances(
    //         [owner, lock],
    //         [lockedAmount, -lockedAmount]
    //       );
    //     });
    //   });
  });
});
