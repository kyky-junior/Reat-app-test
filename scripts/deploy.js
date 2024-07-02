const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60; // Définir le délai de verrouillage (60 secondes)

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: hre.ethers.utils.parseEther("1") });

  await lock.deployed();

  console.log("Lock deployed to:", lock.address);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
