import React from 'react';
import { BlockProvider } from './context/Blockcontext';
import Details from './components/Details';
import File from './components/File';

export const ContractAbi = [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "fileHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "holder",
        "type": "address"
      }
    ],
    "name": "FileUploaded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "fileHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "expirationTime",
        "type": "uint256"
      }
    ],
    "name": "PermissionGranted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      }
    ],
    "name": "getFileInfoById",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "fileHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "encryptedFileAesKey",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "encryptedFilePrivateKey",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fileType",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "metadataHash",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "issuer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "holder",
            "type": "address"
          }
        ],
        "internalType": "struct VerifierContract.FileInfoView",
        "name": "info",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_holder",
        "type": "address"
      }
    ],
    "name": "getHolderFileInfos",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          }
        ],
        "internalType": "struct VerifierContract.FileIdName[]",
        "name": "result",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_requester",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      }
    ],
    "name": "grantPermissionToFileInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "fileHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "holder",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "metadataHash",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "encryptedFileAesKey",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "encryptedFilePrivateKey",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fileType",
            "type": "string"
          }
        ],
        "internalType": "struct VerifierContract.FileUploadParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "uploadFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_metadataHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyFileByMetaHash",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
export const contractAddress = '0xECB9688f2d725Abf62c927F411f4B5F4576943C5';
export const provider = "https://shape-sepolia.g.alchemy.com/v2/MTZIuWDzO4ttv_IpzoPoesoxwNxvq0T4";


function App() {
  return (
    <BlockProvider>
      
      <File/>
    </BlockProvider>
  );
}

export default App;
