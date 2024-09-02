import React, { useEffect, useState } from 'react';
import getHolderFiles from '../utils/ViewUtils';
import { ethers } from 'ethers';
import getFileViaId from '../utils/getFile';
import requestPermissionForFile from '../utils/requestPermission';
import getAndDecryptFile from '../utils/openFile';

export default function View() {
  const [files, setFiles] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(''); 
  const [selectedTimeInSeconds, setSelectedTimeInSeconds] = useState(0); 
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

  useEffect(() => {
    const getAddress = async () => {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setSearchAddress(accounts[0]);
      } else {
        console.error('No accounts found');
      }
    };
    getAddress();
  }, []);

  const fetchFiles = async () => {
    if (!searchAddress) return;

    try {
      const holderFiles = await getHolderFiles(searchAddress);
      if (Array.isArray(holderFiles)) {
        setFiles(holderFiles);
      } else {
        console.error("getHolderFiles did not return an array");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    if (searchAddress) {
      fetchFiles();
    }
  }, [searchAddress]);

  const handleSearch = () => {
    fetchFiles();
  };

  const handleFileClick = async (file, index) => {
    setSelectedFileIndex(index);
    setSelectedFile(file);
    try {
      const fileInfo = await getFileViaId(file.id);
      await getAndDecryptFile(fileInfo);
    } catch (error) {
      console.error('An error occurred:', error.errorName);
        if (error.code === 'ACTION_REJECTED') {
            throw new Error('MetaMask transaction was rejected by the user');
        }
        setModalVisible(true);
        throw error;
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedFile(null);
  };

  const handleTimeSelection = (timePeriod) => {
    setSelectedTime(timePeriod);
  
    let timeInSeconds = 0;
    switch (timePeriod) {
      case '1 Day':
        timeInSeconds = 24 * 60 * 60;
        break;
      case '1 Week':
        timeInSeconds = 7 * 24 * 60 * 60;
        break;
      case '1 Month':
        timeInSeconds = 30 * 24 * 60 * 60;
        break;
      default:
        timeInSeconds = 0;
    }
  
    setSelectedTimeInSeconds(timeInSeconds);
  
    // Log the updated timeInSeconds immediately after the state update
    console.log("Selected time in seconds:", timeInSeconds);
  };
  

  const handlePermission = async () => {
    console.log("Permission requested for file:", selectedFile, "for", selectedTimeInSeconds, "seconds.");
    console.log("Files before permission", files)
    await requestPermissionForFile(files[selectedFileIndex].id, files[selectedFileIndex].fileName, searchAddress, selectedTimeInSeconds);
    handleCloseModal();
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-col items-center'>
        <div className='flex gap-3 w-full max-w-md p-6 rounded-md mt-10'>
          <input 
            value={searchAddress}
            type="search" 
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
            placeholder='Enter the wallet address' 
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button onClick={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
            strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search hover:scale-110 transition-all">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-4 m-10'>
        <h1 className='font-bold text-3xl text-gray-700 border-b-4 w-fit border-b-blue-950'>Your wallet files are:</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[100%] mt-5'>
          {Array.isArray(files) && files.length > 0 ? (
            files.map((f, index) => (
              <div 
                key={index} 
                className='bg-black text-white group hover:bg-zinc-300 hover:scale-110 transition-all hover:cursor-pointer duration-500 p-5 shadow-md rounded-lg border border-gray-300'
                onClick={() => handleFileClick(f, index)} 
              >
                <h1 className='text-xl font-semibold uppercase group-hover:text-gray-800'>{f.fileName}</h1>
                <h3 className='text-lg tracking-tight text-white group-hover:text-gray-800'>
                  Card No: <span className='font-medium  text-white group-hover:text-gray-700'>XXX...{f.id.slice(-4)}</span>
                </h3>
              </div>
            ))
          ) : (
            <p>No files found</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h2 className='text-xl font-semibold mb-4'>Permission Request</h2>
            <p className='mb-4'>Do you want to request permission to access the file:<span className=' font-semibold uppercase'> {selectedFile?.fileName}? </span></p>
            <div className='flex flex-col justify-end gap-4'>
              <div className='flex flex-col gap-4'>
                <h1 className=' text-lg tracking-tight font-medium'>Select the time period of access</h1>
                <div className='flex gap-2'>
                  <button 
                    onClick={() => handleTimeSelection('1 Day')} 
                    className={`p-2 rounded-md ${selectedTime === '1 Day' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                    1 Day
                  </button>
                  <button 
                    onClick={() => handleTimeSelection('1 Week')} 
                    className={`p-2 rounded-md ${selectedTime === '1 Week' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                    1 Week
                  </button>
                  <button 
                    onClick={() => handleTimeSelection('1 Month')} 
                    className={`p-2 rounded-md ${selectedTime === '1 Month' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                    1 Month
                  </button>
                </div>
              </div>
              <div className='flex justify-around gap-2 mt-4'>
                <button onClick={handlePermission} className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Request</button>
                <button onClick={handleCloseModal} className='bg-red-500 text-white px-4 py-2 rounded-lg'>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
