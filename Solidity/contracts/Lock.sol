// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerifierContract {
    address public owner;

    struct FileInfo {
        string id;
        bytes32 fileHash;
        bytes32 metadataHash;
        bytes encryptedFileKey;
        address holder;
        bool exists;
    }

    struct FileData {
        string id;
        bytes32 metadataHash;
        bytes encryptedFileKey;
    }

    mapping(bytes32 => FileInfo) public files;
    mapping(bytes32 => FileInfo) public metaFile;
    mapping(string => FileInfo) public filesById;
    mapping(address => bytes32[]) public holderFiles;

    event FileUploaded(bytes32 indexed fileHash, address indexed holder);
    event ZKPVerified(address indexed user, bool valid);

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier fileExists(bytes32 _fileHash) {
        require(files[_fileHash].exists, "File does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function uploadFile(
        bytes32 _fileHash,
        FileData memory fileData
    ) external {
        require(!files[_fileHash].exists, "File already exists");

        files[_fileHash] = FileInfo({
            id: fileData.id,
            fileHash: _fileHash,
            metadataHash: fileData.metadataHash,
            encryptedFileKey: fileData.encryptedFileKey,
            holder: msg.sender,
            exists: true
        });
        metaFile[fileData.metadataHash] = files[_fileHash];
        filesById[fileData.id] = files[_fileHash];
        holderFiles[msg.sender].push(_fileHash);
        emit FileUploaded(_fileHash, msg.sender);
    }

    function getFileInfo(bytes32 _fileHash) public view fileExists(_fileHash) returns (FileInfo memory) {
        return files[_fileHash];
    }

    function verifyFileByMetaHash(bytes32 _metadataHash) external view returns (bool) {
        require(metaFile[_metadataHash].exists, "File does not exist");
        return true;
    }

    function getFileInfoById(string memory _id) public view returns (FileInfo memory) {
        require(filesById[_id].exists, "File does not exist");
        return filesById[_id];
    }

    function getHolderFileInfos(address _holder) public view returns (FileInfo[] memory) {
        bytes32[] memory holderFileHashes = holderFiles[_holder];
        FileInfo[] memory fileInfos = new FileInfo[](holderFileHashes.length);

        for (uint i = 0; i < holderFileHashes.length; i++) {
            fileInfos[i] = files[holderFileHashes[i]];
        }

        return fileInfos;
    }
}



// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

// contract VerifierContract is ERC2771Context {
//     address public owner;
//     bytes32 public DOMAIN_SEPARATOR;
//     bytes32 public constant PERMIT_TYPEHASH = keccak256(
//         "Permit(address holder,bytes32 fileHash,FileData fileData,uint256 nonce,uint256 expiry)"
//     );
//     mapping(address => uint) public nonces;

//     struct FileInfo {
//         string id;
//         bytes32 fileHash;
//         bytes32 metadataHash;
//         bytes encryptedFileKey;
//         address holder;
//         bool exists;
//     }

//     struct FileData {
//         string id;
//         bytes32 metadataHash;
//         bytes encryptedFileKey;
//     }

//     mapping(bytes32 => FileInfo) public files;
//     mapping(string => FileInfo) public filesById;
//     mapping(address => bytes32[]) public holderFiles;

//     event FileUploaded(bytes32 indexed fileHash, address indexed holder);
//     event ZKPVerified(address indexed user, bool valid);

//     modifier onlyOwner {
//         require(_msgSender() == owner, "You are not the owner");
//         _;
//     }

//     modifier fileExists(bytes32 _fileHash) {
//         require(!files[_fileHash].exists, "File already exists");
//         _;
//     }

//     constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {
//         owner = _msgSender();
//         DOMAIN_SEPARATOR = keccak256(
//             abi.encode(
//                 keccak256("EIP712Domain(string name,string version,address verifyingContract)"),
//                 keccak256(bytes("VerifierContract")),
//                 keccak256(bytes("1")),
//                 address(this)
//             )
//         );
//     }

//     function permitUpload(
//         address holder,
//         bytes32 _fileHash,
//         FileData memory fileData,
//         uint256 nonce,
//         uint256 expiry,
//         uint8 v,
//         bytes32 r,
//         bytes32 s
//     ) external fileExists(_fileHash) {
//         require(expiry == 0 || block.timestamp <= expiry, "Permit expired");
//         require(nonce == nonces[holder]++, "Invalid nonce");

//         bytes32 digest = keccak256(
//             abi.encodePacked(
//                 "\x19\x01",
//                 DOMAIN_SEPARATOR,
//                 keccak256(abi.encode(PERMIT_TYPEHASH, holder, _fileHash, fileData, nonce, expiry))
//             )
//         );

//         address recoveredAddress = ecrecover(digest, v, r, s);
//         require(recoveredAddress != address(0) && recoveredAddress == holder, "Invalid signature");

//         _uploadFile(_fileHash, fileData, holder);
//     }

//     function _uploadFile(
//         bytes32 _fileHash,
//         FileData memory fileData,
//         address _holder
//     ) internal {
//         files[_fileHash] = FileInfo({
//             id: fileData.id,
//             fileHash: _fileHash,
//             metadataHash: fileData.metadataHash,
//             encryptedFileKey: fileData.encryptedFileKey,
//             holder: _holder,
//             exists: true
//         });
//         filesById[fileData.id] = files[_fileHash];
//         holderFiles[_holder].push(_fileHash);
//         emit FileUploaded(_fileHash, _holder);
//     }

//     function getNonces(address account) external view returns (uint) {
//         return nonces[account];
//     }


//     function getFileInfo(bytes32 _fileHash) public view fileExists(_fileHash) returns (FileInfo memory) {
//         return files[_fileHash];
//     }

//     function verifyFileByHash(bytes32 _fileHash) external view fileExists(_fileHash) returns (bool) {
//         return true;
//     }

//     function getFileInfoById(string memory _id) public view returns (FileInfo memory) {
//         require(filesById[_id].exists, "File does not exist");
//         return filesById[_id];
//     }

//     function getHolderFiles(address _holder) public view returns (bytes32[] memory) {
//         return holderFiles[_holder];
//     }

//     function getHolderFileInfos(address _holder) public view returns (FileInfo[] memory) {
//         bytes32[] memory holderFileHashes = holderFiles[_holder];
//         FileInfo[] memory fileInfos = new FileInfo[](holderFileHashes.length);

//         for (uint i = 0; i < holderFileHashes.length; i++) {
//             fileInfos[i] = files[holderFileHashes[i]];
//         }

//         return fileInfos;
//     }

//     function IsTrustedForwarder(address forwarder) public view returns (bool) {
//         return ERC2771Context.isTrustedForwarder(forwarder);
//     }
// }