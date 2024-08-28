import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
      <div className="flex flex-col sm:flex-row justify-between bg-white rounded-lg shadow-xl p-8 max-w-6xl w-full">
        <img
          src="https://etimg.etb2bimg.com/thumb/msid-102885180,width-1200,resizemode-4/.jpg"
          className="rounded-full h-72 w-72 object-cover shadow-md transition-transform transform hover:scale-105"
          alt="Welcome Image"
        />
        <div className="flex flex-col gap-6 mt-4 sm:mt-0 sm:ml-12">
          <h1 className="text-4xl font-bold text-gray-800">Hey welcome to Berrify!</h1>
          <p className="text-lg text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis eaque sequi quis, architecto ex repellendus pariatur.
          </p>
      <Link to={'/verification'}>    <button className="self-start mt-4 bg-black text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-colors">
            Get Verification
          </button></Link> 
        </div>
      </div>
    </div>
  );
}
