import React, { useContext, useRef, useState } from 'react';
import { BlockContext } from '../context/Blockcontext';

export default function File() {
  const { handleFile, file } = useContext(BlockContext);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleClick = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile); // Call handleFile correctly
  };

  const handleDelete = (e) => {
    e.preventDefault();
    handleFile(null); // Clear the file from the context
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input value
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file !!...");
      return; // Exit early if no file is selected
    }

    const formdata = new FormData();
    formdata.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/getfile', {
        method: 'POST',
        body: formdata,
      });
      const data = await response.json();
      console.log(data);
      setError('');
    } catch (e) {
      console.log(e);
      setError('Error occurred while uploading the file.');
    }
  };

  return (
    <div className='background flex flex-col h-screen items-center justify-center p-6'>
      <div className='bg-white flex flex-col gap-10 p-6 rounded-lg shadow-xl max-w-lg w-full'>
        <label htmlFor="file-upload" className='text-xl font-semibold text-gray-700'>Upload your file</label>
        <div className=' flex flex-row gap-4'>
        <input
          type='file'
          onChange={handleClick}
          className='border border-gray-300 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-200'
          id="file-upload"
          ref={fileInputRef} // Attach the ref to the input
        />
        <button
          onClick={handleDelete}
          
        >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2 text-red-500 hover:scale-110"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
        </div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button
          onClick={handleSubmit}
          className='bg-green-400 text-white font-semibold rounded-md w-40 p-2 mx-auto hover:bg-green-500 transition-all duration-200'
        >
          Upload File
        </button>
      </div>
    </div>
  );
}
