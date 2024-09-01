// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract VerifierContract {
    address public immutable owner;

    struct FileInfo {
        string fileHash;
        string fileName;
        string encryptedFileAesKey;
        string encryptedFilePrivateKey;
        string fileType;
        bytes32 metadataHash;
        address issuer;
        address holder;
        address[] permissions;
        mapping(address => uint256) permissionExpirations; // Mapping cannot be returned in public/external functions
    }

    struct FileInfoView {
        string fileHash;
        string fileName;
        string encryptedFileAesKey;
        string encryptedFilePrivateKey;
        string fileType;
        bytes32 metadataHash;
        address issuer;
        address holder;
    }

    struct FileUploadParams {
        string fileHash;
        string fileName;
        address holder;
        string id;
        bytes32 metadataHash;
        string encryptedFileAesKey;
        string encryptedFilePrivateKey;
        string fileType;
    }

    struct FileIdName {
        string id;
        string fileName;
    }

    mapping(string => FileInfo) private _files;
    mapping(bytes32 => string) private _metaFileHashToFileHash;
    mapping(string => string) private _idToFileHash;
    mapping(address => string[]) private _holderFiles;

    event FileUploaded(string indexed fileHash, address indexed holder);
    event PermissionGranted(string indexed fileHash, address indexed requester, uint256 expirationTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    /**
     * @dev Upload a file's details to the contract.
     * @param params The struct containing all necessary parameters to upload a file.
     */
    function uploadFile(FileUploadParams calldata params) external {
        require(bytes(_files[params.fileHash].fileHash).length == 0, "File exists");

        FileInfo storage fileInfo = _files[params.fileHash];
        fileInfo.fileHash = params.fileHash;
        fileInfo.metadataHash = params.metadataHash;
        fileInfo.encryptedFileAesKey = params.encryptedFileAesKey;
        fileInfo.encryptedFilePrivateKey = params.encryptedFilePrivateKey;
        fileInfo.issuer = msg.sender;
        fileInfo.holder = params.holder;
        fileInfo.fileName = params.fileName;
        fileInfo.fileType = params.fileType;

        _metaFileHashToFileHash[params.metadataHash] = params.fileHash;
        _idToFileHash[params.id] = params.fileHash;
        _holderFiles[params.holder].push(params.id);

        emit FileUploaded(params.fileHash, params.holder);
    }

    /**
     * @dev Verify if a file exists using its metadata hash.
     * @param _metadataHash The hash of the file's metadata.
     * @return exists True if the file exists, otherwise false.
     */
    function verifyFileByMetaHash(bytes32 _metadataHash) external view returns (bool exists) {
        exists = bytes(_metaFileHashToFileHash[_metadataHash]).length != 0;
    }

    /**
     * @dev Grant permission to a requester to access file information for a limited time.
     * @param _id The unique identifier of the file.
     * @param _requester The address of the requester.
     * @param _duration The duration (in seconds) for which the permission is granted.
     */
    function grantPermissionToFileInfo(string calldata _id, address _requester, uint256 _duration) external {
        string storage fileHash = _idToFileHash[_id];
        require(bytes(fileHash).length != 0, "File missing");

        FileInfo storage fileInfo = _files[fileHash];
        uint256 expirationTime = block.timestamp + _duration;
        fileInfo.permissionExpirations[_requester] = expirationTime;

        // Only add to permissions array if not already present
        bool alreadyHasPermission = false;
        uint256 length = fileInfo.permissions.length;

        for (uint256 i = 0; i < length; ) {
            if (fileInfo.permissions[i] == _requester) {
                alreadyHasPermission = true;
                break;
            }
            unchecked { ++i; }
        }

        if (!alreadyHasPermission) {
            fileInfo.permissions.push(_requester);
        }

        emit PermissionGranted(fileHash, _requester, expirationTime);
    }

    /**
     * @dev Get a view of the file information by its unique identifier (excluding mapping).
     * @param _id The unique identifier of the file.
     * @return info The file information view (without mapping).
     */
    function getFileInfoById(string calldata _id) external view returns (FileInfoView memory info) {
        string storage fileHash = _idToFileHash[_id];
        require(bytes(fileHash).length != 0, "File missing");

        FileInfo storage fileInfo = _files[fileHash];

        if (msg.sender != fileInfo.holder) {
            require(hasValidPermission(fileInfo, msg.sender), "No valid permission");
        }

        // Return a struct that excludes the mapping
        info = FileInfoView({
            fileHash: fileInfo.fileHash,
            fileName: fileInfo.fileName,
            encryptedFileAesKey: fileInfo.encryptedFileAesKey,
            encryptedFilePrivateKey: fileInfo.encryptedFilePrivateKey,
            fileType: fileInfo.fileType,
            metadataHash: fileInfo.metadataHash,
            issuer: fileInfo.issuer,
            holder: fileInfo.holder
        });
    }

    /**
     * @dev Get all files associated with a holder.
     * @param _holder The address of the file holder.
     * @return result An array of FileIdName structs containing file ids and names.
     */
    function getHolderFileInfos(address _holder) external view returns (FileIdName[] memory result) {
        string[] storage fileIds = _holderFiles[_holder];
        uint256 length = fileIds.length;

        // Allocate memory for result array
        result = new FileIdName[](length);

        for (uint256 i = 0; i < length; ) {
            string storage fileHash = _idToFileHash[fileIds[i]];
            result[i] = FileIdName({
                id: fileIds[i],
                fileName: _files[fileHash].fileName
            });
            unchecked { ++i; }
        }
    }

    /**
     * @dev Check if the requester has a valid permission to access the file.
     * @param fileInfo The FileInfo struct containing permission details.
     * @param requester The address of the requester.
     * @return isValid True if the permission is valid, otherwise false.
     */
    function hasValidPermission(FileInfo storage fileInfo, address requester) internal view returns (bool isValid) {
        uint256 expirationTime = fileInfo.permissionExpirations[requester];
        isValid = expirationTime > block.timestamp;
    }
}
