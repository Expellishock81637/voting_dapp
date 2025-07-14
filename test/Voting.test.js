const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting, owner, addr1, addr2;

  beforeEach(async () => {
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2] = await ethers.getSigners();
    voting = await Voting.deploy(["Alice", "Bob"], 1); // 投票期 1 分鐘
    await voting.waitForDeployment();
  });

  it("should return all candidates", async function () {
    const names = await voting.getCandidates();
    expect(names).to.deep.equal(["Alice", "Bob"]);
  });

  it("should allow voting after start", async function () {
    await network.provider.send("evm_increaseTime", [20]);
    await voting.connect(addr1).vote("Alice");
    const count = await voting.totalVotesFor("Alice");
    expect(count).to.equal(1);
  });

  it("should NOT allow voting before start", async function () {
    await expect(voting.connect(addr1).vote("Bob")).to.be.revertedWith("Voting is not active.");
  });

  it("should NOT allow voting after end", async function () {
    await network.provider.send("evm_increaseTime", [70]); // 投票期已結束
    await expect(voting.connect(addr1).vote("Alice")).to.be.revertedWith("Voting is not active.");
  });

  it("should NOT allow double voting", async function () {
    await network.provider.send("evm_increaseTime", [20]);
    await voting.connect(addr1).vote("Alice");
    await expect(voting.connect(addr1).vote("Bob")).to.be.revertedWith("You have already voted.");
  });

  it("should NOT allow voting for unknown candidate", async function () {
    await network.provider.send("evm_increaseTime", [20]);
    await expect(voting.connect(addr1).vote("Charlie")).to.be.revertedWith("Candidate does not exist.");
  });

  it("should return correct vote counts for each candidate", async function () {
    await network.provider.send("evm_increaseTime", [20]);
    await voting.connect(addr1).vote("Alice");
    await voting.connect(addr2).vote("Bob");

    const countAlice = await voting.totalVotesFor("Alice");
    const countBob = await voting.totalVotesFor("Bob");

    expect(countAlice).to.equal(1);
    expect(countBob).to.equal(1);
  });

  it("should not allow voting after end even if it was started before", async function () {
    await network.provider.send("evm_increaseTime", [20]);
    await voting.connect(addr1).vote("Alice");

    await network.provider.send("evm_increaseTime", [60]); // 超過 1 分鐘
    await expect(voting.connect(addr2).vote("Bob")).to.be.revertedWith("Voting is not active.");
  });
});
