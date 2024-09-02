import { ethers } from 'ethers';
import FileEncrypt from './ecc';
import { ContractAbi } from '../App';
import { contractAddress } from '../App';
import { create } from 'ipfs-http-client';

const ipfs = create({
  host: 'localhost',
  port: '5001',
  protocol: 'http',
});

export default async function uploadFileToContract(file, data, _fileName, _holder) {
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
    
    // Upload file to IPFS
    console.log("File", encryptedFileData.file)
    const added = await ipfs.add(encryptedFileData.file);
    console.log('File uploaded successfully. IPFS hash:', added.path);
    const fileHash = added.path;

    const fileData = {
      fileHash: fileHash,
      fileName: _fileName,
      holder: ethers.utils.getAddress(_holder),
      id: data["ui"], 
      metadataHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(data))),
    };

    // Call the uploadFile function
    console.log("Before sending request to blockchain", fileData);
    async function callFunction(fileData) {
      try {
        const method = contract.interface.encodeFunctionData('uploadFile', [fileData]);

        // Estimate gas
        const gasEstimate = await contract.estimateGas.uploadFile(fileData);
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

    callFunction(fileData);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}
