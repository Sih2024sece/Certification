import { ethers } from 'ethers';
import { ContractAbi } from '../App';
import { contractAddress } from '../App';

export default async function getHolderFiles(_address){
    try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        

        // Setup ethers provider and signer with MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Setup contract
        const contract = new ethers.Contract(contractAddress, ContractAbi, signer);

        var account="";
        
        if(_address === ""){
            account = await provider.listAccounts()[0];
            console.log("Account", account);
        }else{
            account = ethers.utils.getAddress(_address);
        }
        const result = await contract.callStatic.getHolderFileInfos(account);
        console.log('Files result:', result);
        return result;
    } catch (error) {
        console.error('An error occurred:', error);
        if (error.code === 'ACTION_REJECTED') {
            throw new Error('MetaMask transaction was rejected by the user');
        }
        throw error;
    }
}