import { ethers } from 'ethers';
import FileEncrypt from './ecc';

import { ContractAbi } from '../App';
import { contractAddress } from '../App';

export default async function uploadFileToContract(file, data) {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file object');
    }

    // Encrypt the file
    const encryptedFileData = await FileEncrypt(file);

    if (!encryptedFileData || !encryptedFileData.file) {
      throw new Error('File encryption failed');
    }

    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }


    // Setup ethers provider and signer with MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Setup contract
    const contract = new ethers.Contract(contractAddress, ContractAbi, signer);

    // Create file hash and metadata
    // Read the file as binary data
    const arrayBuffer = await file.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    
        // Convert byte array to a hash
    const fileHash = ethers.utils.keccak256(ethers.utils.hexlify(byteArray));
    const encryptedFileKeyBytes = ethers.utils.toUtf8Bytes(encryptedFileData.AesKey);

    const fileData = {
      id: data["Aadhaar Number"], // Replace 'file1' with dynamic ID if necessary
      metadataHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(data))),
      encryptedFileKey: encryptedFileKeyBytes
    };

    // Call the uploadFile function
    console.log("Before sending request to blockchain", fileHash, fileData);
    async function callFunction(fileHash, fileData) {
      try {
        const method = contract.interface.encodeFunctionData('uploadFile', [fileHash, fileData]);

        // Estimate gas
        const gasEstimate = await contract.estimateGas.uploadFile(fileHash, fileData);
        console.log('Estimated Gas:', gasEstimate.toString());

        // Get current gas price
        const gasPrice = await provider.getGasPrice();
        console.log('Current Gas Price:', gasPrice.toString());

        // Check account balance
        const balance = await provider.getBalance(await signer.getAddress());
        console.log('Account Balance:', ethers.utils.formatEther(balance));

        // Prepare transaction
        const tx = {
          to: contractAddress,
          data: method,
          gasLimit: gasEstimate, // Estimate gas limit
          gasPrice: gasPrice, // For EIP-1559, use maxFeePerGas and maxPriorityFeePerGas instead
        };

        // Send transaction
        const txResponse = await signer.sendTransaction(tx);
        console.log('Transaction hash:', txResponse.hash);

        // Wait for transaction to be mined
        const receipt = await txResponse.wait();
        console.log('Transaction receipt:', receipt);
      } catch (error) {
        console.error('An error occurred during the transaction:', error);
        throw error;
      }
    }

    callFunction(fileHash, fileData);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}
