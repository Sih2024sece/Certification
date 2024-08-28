const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("VerifierContractModule", (m) => {

  // Deploy the VerifierContract (Implementation)
  const verifierContract = m.contract("VerifierContract");

  
  console.log("VerifierContract deployed at:", verifierContract.address);



  return { verifierContract };
});
