import React, { createContext, useState } from "react";

export const BlockContext = createContext();

export const BlockProvider = ({ children }) => {
  const [file, setFile] = useState(null);

  const handleFile = (selectedFile) => {
    try {
      setFile(selectedFile);
      console.log("The file is ", selectedFile);
    } catch (error) {
      console.error('Error handling file:', error);
    }
  };

  const val = {
    file,
    handleFile,
  };

  return (
    <BlockContext.Provider value={val}>
      {children}
    </BlockContext.Provider>
  );
};
