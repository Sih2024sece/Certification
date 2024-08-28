const { ethers } = require("hardhat");
async function main() {
  const trustedForwarderAddress = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";

  // Deploy VerifierContract
  console.log("Deploying VerifierContract...");
  const VerifierContract = await ethers.getContractFactory("VerifierContract");
  const verifier = await VerifierContract.deploy(trustedForwarderAddress);
  await verifier.waitForDeployment();
  console.log("VerifierContract deployed to:", verifier.target);

  // Deploy the ProxyContract, pointing to the VerifierContract implementation
  // console.log("Deploying ProxyContract...");
  // const ProxyContract = await ethers.getContractFactory("VerifierProxy");
  // const proxy = await ProxyContract.deploy(verifier.target);
  // await proxy.waitForDeployment();
  // console.log("ProxyContract deployed to:", proxy.target);

  // Verify the deployment
  console.log("VerifierContract address:", verifier.target);
  // console.log("ProxyContract address:", proxy.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
