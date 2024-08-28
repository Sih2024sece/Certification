import { ethers } from 'ethers';
import { ContractAbi } from '../App';
import { provider } from '../App'; // Ensure this is the MetaMask provider
import { contractAddress } from '../App';

export default async function getFileByHash(fileHash) {
  try {
    if (!fileHash) {
      throw new Error('Invalid file hash');
    }

    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Setup ethers provider and signer with MetaMask
    const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = ethProvider.getSigner();

    // Setup contract
    const contract = new ethers.Contract(contractAddress, ContractAbi, signer);

    // Prepare transaction call
    const method = contract.interface.encodeFunctionData('verifyFileByHash', [fileHash]);

    async function callFunction() {
      try {

        const gasEstimate = await contract.estimateGas.verifyFileByHash(fileHash);
        console.log('Estimated Gas:', gasEstimate.toString());

        // Get current gas price
        const gasPrice = await provider.getGasPrice();
        console.log('Current Gas Price:', gasPrice.toString());

        // Check account balance
        const balance = await provider.getBalance(await signer.getAddress());
        console.log('Account Balance:', ethers.utils.formatEther(balance));

        // Call the contract method
        const txResponse = await signer.sendTransaction({
          to: contractAddress,
          data: method,
          gasLimit: gasEstimate, // Estimate gas limit
          gasPrice: gasPrice, // For EIP-1559, use maxFeePerGas and maxPriorityFeePerGas instead
        });

        console.log('Transaction hash:', txResponse.hash);

        // Wait for the transaction to be mined
        const receipt = await txResponse.wait();
        console.log('Transaction receipt:', receipt);

        // Decode the result from the receipt (if needed)
        // const result = await contract.getFileInfo(fileHash); // Or another method if the function is a view function
        // console.log('Result:', result);
      } catch (error) {
        console.error('An error occurred during the transaction:', error);
        throw error;
      }
    }

    callFunction();
  } catch (error) {
    console.error('An error occurred:', error);
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('MetaMask transaction was rejected by the user');
    }
    throw error;
  }
}
