import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Verify from './components/Verify';
import Home from './components/Home';
import { BlockProvider } from './context/Blockcontext';

import View from './components/View';

export const ContractAbi = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"inputs":[],"name":"FileExists","type":"error"},{"inputs":[],"name":"FileMissing","type":"error"},{"inputs":[],"name":"NoValidPermission","type":"error"},{"inputs":[],"name":"NotFileHolder","type":"error"},{"inputs":[],"name":"NotOwner","type":"error"},{"inputs":[],"name":"RequestNotFound","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"fileHash","type":"string"},{"indexed":true,"internalType":"address","name":"holder","type":"address"}],"name":"FileUploaded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"fileHash","type":"string"},{"indexed":true,"internalType":"address","name":"requester","type":"address"},{"indexed":false,"internalType":"uint256","name":"expirationTime","type":"uint256"}],"name":"PermissionGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"fileId","type":"string"},{"indexed":true,"internalType":"address","name":"holder","type":"address"},{"indexed":true,"internalType":"address","name":"requester","type":"address"},{"indexed":false,"internalType":"bool","name":"granted","type":"bool"}],"name":"PermissionRequestHandled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"fileId","type":"string"},{"indexed":true,"internalType":"address","name":"holder","type":"address"},{"indexed":true,"internalType":"address","name":"requester","type":"address"},{"indexed":false,"internalType":"uint256","name":"duration","type":"uint256"}],"name":"PermissionRequested","type":"event"},{"inputs":[{"internalType":"string","name":"_id","type":"string"}],"name":"getFileInfoById","outputs":[{"components":[{"internalType":"string","name":"fileHash","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"bytes32","name":"metadataHash","type":"bytes32"},{"internalType":"address","name":"holder","type":"address"}],"internalType":"struct VerifierContract.FileInfoView","name":"info","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"getHolderFileInfos","outputs":[{"components":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"fileName","type":"string"}],"internalType":"struct VerifierContract.FileIdName[]","name":"result","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"getPendingRequests","outputs":[{"components":[{"internalType":"string","name":"fileId","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"address","name":"requester","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"}],"internalType":"struct VerifierContract.PermissionRequest[]","name":"pendingRequests","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_fileId","type":"string"},{"internalType":"address","name":"_requester","type":"address"},{"internalType":"bool","name":"_granted","type":"bool"}],"name":"handlePermissionRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_fileId","type":"string"},{"internalType":"string","name":"_fileName","type":"string"},{"internalType":"address","name":"_holder","type":"address"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"requestPermission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"fileHash","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"address","name":"holder","type":"address"},{"internalType":"string","name":"id","type":"string"},{"internalType":"bytes32","name":"metadataHash","type":"bytes32"}],"internalType":"struct VerifierContract.FileUploadParams","name":"params","type":"tuple"}],"name":"uploadFile","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_metadataHash","type":"bytes32"}],"name":"verifyFileByMetaHash","outputs":[{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"}]
export const contractAddress = '0x056AbC740acf2923CB16F12bcEc3f58CF182464C';
export const provider = "https://shape-sepolia.g.alchemy.com/v2/MTZIuWDzO4ttv_IpzoPoesoxwNxvq0T4";

function App() {
  return (
    <BlockProvider>
      <Router>
        <Navbar />
        <Routes>
         <Route path="/" element={<Home />} />
          <Route path="/verification" element={<Verify />} />
          <Route path="/view" element={<View />} />
        </Routes>
      </Router>
    </BlockProvider>
  );
}

export default App;
