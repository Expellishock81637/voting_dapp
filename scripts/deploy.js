const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 使用帳號部署:", deployer.address);

  // === 傳給 constructor 的 3 個參數 ===
  const candidateNames = ["Alice", "Bob", "Charlie"]; // ← 你可以改成你要的候選人
  const durationInMinutes = 5;
  const isAnonymous = false;

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames, durationInMinutes, isAnonymous);
  await voting.waitForDeployment();

  console.log("✅ Voting 合約部署完成:", voting.target);
}

main().catch((error) => {
  console.error("❌ 部署失敗:", error);
  process.exitCode = 1;
});
