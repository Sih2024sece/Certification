import React, { useContext, useState } from 'react';
import { BlockContext } from '../context/Blockcontext';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheckCircle } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import getFileByHash from '../utils/verifyFile';

export default function Verify() {
  const { handleFile, file } = useContext(BlockContext);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file!");
      return;
    }

    const formData = new FormData();
    const slectedType= document.querySelector('select').value;
    formData.append('file', file);  
    formData.append('type', slectedType);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/getfile', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      const result = await getFileByHash(data);
      console.log("The result is ",result);
      setError('');
      
      // Show success toast after upload
      if(result){
      toast.success("File exists !", {
        icon: <FaCheckCircle style={{ color: 'white' }} />, // Custom icon with specific color
        style: {
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "8px",
        },
      });
    }
    else{
      toast.error("File doesn't exists in the chain !");
    }

    } catch (error) {
      console.error(error);
      setError('Error occurred while uploading the file.');
      toast.error("Failed to upload file!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-6">
      <ToastContainer /> {/* Toast container to show notifications */}

      <div className="flex gap-2 mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00ff00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-badge-check"
        >
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800">Verify Your Documents</h1>
      </div>

      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        Upload your file to see whether it is a temperless document or not!
      </p>

      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg relative">
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 relative"
          >
            {!preview && (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-12 h-12 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18m-6 4l4-4m0 0l-4-4"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
              </div>
            )}
            <input
              id="file-upload"
              onChange={handleClick}
              type="file"
              className="hidden"
            />
            {preview && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <img
                  src={preview}
                  alt="Selected preview"
                  className="max-w-full max-h-full object-contain"
                  style={{ maxWidth: '80%', maxHeight: '80%' }}
                />
              </div>
            )}
          </label>
          <div className="flex flex-col space-y-2 w-full">
          <label className="text-xl font-semibold text-gray-700">
            File type
          </label>
          <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
            <option selected>Select your file</option>
            <option value="aadhaar">Aadhaar</option>
            <option value="pan">PAN</option>
          </select>
        </div>

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 hover:scale-x-110 transition-all flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
