const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// Replace these values with appropriate defaults if needed
const DEFAULT_CHAIN_ID = 11155111; // Mainnet, replace with your desired network's chain ID

module.exports = buildModule("VerifierContractModule", (m) => {
  const chainId = m.getParameter("chainId", DEFAULT_CHAIN_ID);

  // Deploy the VerifierContract (Implementation)
  const verifierContract = m.contract("VerifierContract", [chainId]);

  // Deploy the ProxyContract, pointing to the VerifierContract implementation
  const proxyContract = m.contract("VerifierProxy", [verifierContract]);
  
  console.log("VerifierContract deployed at:", verifierContract.address);
  console.log("ProxyContract deployed at:", proxyContract.address);


  return { verifierContract, proxyContract };
});
