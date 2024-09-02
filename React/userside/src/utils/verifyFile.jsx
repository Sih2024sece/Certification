import { ethers } from 'ethers';
import { ContractAbi } from '../App';
import { provider } from '../App'; // Ensure this is the MetaMask provider
import { contractAddress } from '../App';

export default async function getFileByHash(data) {
  try {
    if (!data) {
      throw new Error('Invalid file hash');
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

    const metaHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(data)));



    const result = await contract.callStatic.verifyFileByMetaHash(metaHash);
    return result;
    console.log('File exists:', result);
  } catch (error) {
    console.error('An error occurred:', error);
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('MetaMask transaction was rejected by the user');
    }
    throw error;
  }
}
