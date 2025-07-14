// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");

  const candidateNames = ["Alice", "Bob", "Charlie"];
  const durationInMinutes = 5;
  const isAnonymous = false;

  const voting = await Voting.deploy(candidateNames, durationInMinutes, isAnonymous);
  await voting.deployed();

  console.log("✅ Voting deployed to:", voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
