import React, { useContext, useRef, useState } from 'react';
import { BlockContext } from '../context/Blockcontext';
import uploadFileToContract from '../utils/interact';

export default function File() {
  const { handleFile, file,checkMetaMaskConnection } = useContext(BlockContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [holder,setHolder] = useState('');
  const fileInputRef = useRef(null);

  const handleClick = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
    setError(''); // Clear errors on new file selection
  };

  const handleDelete = (e) => {
    e.preventDefault();
    handleFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input value
    }
    setError(''); // Clear any existing errors
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file!");
      return;
    }

    const isMetaMaskConnected = await checkMetaMaskConnection();
    if (!isMetaMaskConnected){
      setError("Please connect your MetaMask wallet!");
      console.log("Please connect your MetaMask wallet!")
      return;
    }
    
    
    const formData = new FormData();
    const slectedType= document.querySelector('select').value;
    formData.append('file', file);
    formData.append('type', slectedType);

    try {
      setLoading(true); // Set loading state
      const response = await fetch('http://localhost:5000/getfile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file data');
      }

      const data = await response.json();
      console.log("Before uploadToFile", data, file);
      await uploadFileToContract(file, data, slectedType, holder);
      setError(''); // Clear any errors on successful upload
    } catch (e) {
      console.error(e);
      setError('Error occurred while uploading the file.');
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <div className='background flex flex-col h-screen items-center justify-center p-6'>
      
      <div className='bg-white flex flex-col gap-10 p-6 rounded-lg shadow-xl max-w-lg w-full'>
        <label htmlFor="file-upload" className='text-xl font-semibold text-gray-700'>
          Upload your file
        </label>
        <div className='flex flex-row gap-4'>
          <input
            type='file'
            onChange={handleClick}
            className='border border-gray-300 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-200'
            id="file-upload"
            ref={fileInputRef}
          />
          {file && (
            <button onClick={handleDelete} className='text-red-500 hover:scale-110'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xl font-semibold text-gray-700">
            File type
          </label>
          <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
            <option selected>Select your file</option>
            <option value="aadhaar">Aadhaar</option>
            <option value="pan">PAN</option>
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xl font-semibold text-gray-700">
            Holder Address
          </label>
          <input value={holder} onChange={(e)=>setHolder(e.target.value)} className='border border-gray-300 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-200' placeholder='0xAB...' type="text" />
        </div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button
          onClick={handleSubmit}
          className='bg-green-400 text-white font-semibold rounded-md w-40 p-2 mx-auto hover:bg-green-500 transition-all duration-200'
          disabled={loading} // Disable the button when loading
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
}
