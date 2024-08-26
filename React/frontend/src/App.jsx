import React from 'react';
import { BlockProvider } from './context/Blockcontext';
import Details from './components/Details';
import File from './components/File';

function App() {
  return (
    <BlockProvider>
      
      <File/>
    </BlockProvider>
  );
}

export default App;
