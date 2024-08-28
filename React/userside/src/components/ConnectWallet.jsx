import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { BlockContext } from '../context/Blockcontext';

const ConnectWallet = () => {
  const { account, setAccount } = useContext(BlockContext);

  useEffect(() => {
    if (window.ethereum) {
      // Initialize ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      window.provider = provider;

      // Check if already connected
      provider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    } else {
      console.log('No Ethereum provider found. Install MetaMask.');
    }
  }, [setAccount]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access or an error occurred!');
      }
    } else {
      console.log('No Ethereum provider found. Install MetaMask.');
    }
  };

  // Function to truncate the wallet address
  const truncateAddress = (addr) => {
    return addr ? `${addr.substring(0, 5)}...` : '';
  };

  return (
    <div>
      <button 
        className='bg-black mb-4 text-white p-4 rounded-md shadow-lg hover:bg-gray-800 transition duration-300'
        onClick={connectWallet}
       >
        {account ? `Connected: ${truncateAddress(account)}` : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default ConnectWallet;
