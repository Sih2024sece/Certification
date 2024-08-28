import React, { createContext, useEffect, useState, useCallback } from "react";
import Web3 from 'web3';

export const web3 = new Web3(Web3.givenProvider);
export const BlockContext = createContext();

export const BlockProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [account, setAccount] = useState(null);
  // const [contractAddress] = useState('0x677C55150d6D8A69E52B0aDB0c639835caF5Dc1f');
  
  const [encryptedFile, setEncryptedFile] = useState(null);


  const handleFile = useCallback((selectedFile) => {
    try {
      setFile(selectedFile);
      console.log("The file is being set in BlockContext", selectedFile);
    } catch (error) {
      console.error('Error handling file:', error);
    }
  }, []);

  useEffect(() => {
    if (file) {
      console.log("The file in BlockContext has been updated:", file);
    }
  }, [file]);

  const checkMetaMaskConnection = async () => {
	if (typeof window.ethereum !== 'undefined') {
	  try {
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		return true;
	  } catch (error) {
		console.error('Failed to connect to MetaMask', error);
		setError('Please connect MetaMask to continue.');
		return false;
	  }
	} else {
	  setError('MetaMask is not installed. Please install it to continue.');
	  return false;
	}
  };

  const val = {
    file,
    handleFile,
    account,
    setAccount,
    encryptedFile,
    setEncryptedFile,
	checkMetaMaskConnection
  };

  return (
    <BlockContext.Provider value={val}>
      {children}
    </BlockContext.Provider>
  );
};