import React, { useEffect, useState } from 'react';
import getHolderPermissionRequests from '../utils/getRequests';
import { formatDuration } from '../utils/formatDuration';
import grantPermissionToFile from '../utils/grantPermission';
import { ethers } from 'ethers';

export default function ShowNotification() {
  const [requests, setRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');

  // Fetch notifications every 10 seconds
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const result = await getHolderPermissionRequests();
        console.log("The Notifications are", result);
        setRequests(result);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setSearchAddress(accounts[0]);
        } else {
          console.error('No accounts found');
        }
      } catch (error) {
        console.error('Failed to fetch requests or account:', error);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const showReq = (request) => {
    // Convert BigNumber to readable duration
    const durationInSeconds = parseInt(request.duration._hex, 16);
    const formattedDuration = formatDuration(durationInSeconds);

    // Update selectedFile with the formatted duration
    setSelectedFile({ ...request, formattedDuration });
    setModalVisible(true);
  };

  const handlePermission = async (grant) => {
    try {
      if (!selectedFile || !searchAddress) {
        throw new Error('Selected file or search address is missing');
      }

      console.log(`Requesting permission for ${selectedFile.fileName} with ID ${selectedFile.fileId} for ${selectedFile.formattedDuration} to grant: ${grant}`);
      console.log(`Holder Address: ${searchAddress}`);

      // Call the grantPermissionToFile function
      await grantPermissionToFile(selectedFile.fileId, selectedFile.requester, grant);
      console.log(`Permission ${grant ? 'granted' : 'denied'} successfully for ${selectedFile.fileName}.`);
    } catch (error) {
      console.error("Failed to grant permission:", error);

      // Specific handling for gas estimation errors
      if (error.code === ethers.errors.UNPREDICTABLE_GAS_LIMIT) {
        alert("The contract likely will revert. Check if the file ID exists, the requester is the correct holder, and the request hasn't already been handled.");
      } else {
        alert(`Failed to process the transaction: ${error.message}`);
      }
    } finally {
      setModalVisible(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-gray-200 shadow-lg p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <p className="text-sm">You have a new notification!</p>
      <div>
        {requests.map((request, index) => (
          <div
            key={index}
            onClick={() => showReq(request)}
            className="flex justify-between hover:cursor-pointer items-center border-b-2 hover:p-2 transition-all hover:shadow-md hover:shadow-slate-500 border-gray-300 py-2"
          >
            <div>
              <h2 className="text-sm font-semibold uppercase">{request.fileName}</h2>
              <p className="text-xs text-gray-500">{request.requester.slice(0, 10)}.....</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80 max-h-[80vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Permission Request</h2>
            <p className='mb-4'>
              Do you want to grant permission to access the file:
              <span className='font-semibold uppercase'> {selectedFile?.fileName}</span>?
            </p>
            <div className='flex flex-col gap-4 mb-4'>
              <h1 className='text-lg tracking-tight font-medium mb-2'>Request of access from</h1>
              <div className='mb-4'>
                <span className='font-semibold text-lg'>Wallet:</span>
                <p className='break-all text-lg'>{selectedFile?.requester}</p>
              </div>
              <div className='mb-4'>
                <span className='font-semibold text-lg'>Duration:</span>
                <p className='break-all text-lg'>{selectedFile?.formattedDuration}</p>
              </div>
            </div>
            <div className='flex justify-around gap-2'>
              <button
                onClick={() => handlePermission(true)}
                className='bg-green-500 text-white px-4 py-2 rounded-lg'
              >
                Grant Request
              </button>
              <button
                onClick={() => handlePermission(false)}
                className='bg-red-500 text-white px-4 py-2 rounded-lg'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
