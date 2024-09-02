// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract VerifierContract {
    address public immutable owner;

    struct FileInfo {
        address holder;
        address[] permissions;
        bytes32 metadataHash;
        string fileHash;
        string fileName;
        mapping(address => uint256) permissionExpirations;
    }

    struct FileInfoView {
        string fileHash;
        string fileName;
        bytes32 metadataHash;
        address holder;
    }

    struct FileUploadParams {
        string fileHash;
        string fileName;
        address holder;
        string id;
        bytes32 metadataHash;
    }

    struct FileIdName {
        string id;
        string fileName;
    }

    struct PermissionRequest {
        string fileId;
        string fileName;
        address requester;
        uint256 duration;  // The duration for which the permission is requested
    }

    mapping(address => PermissionRequest[]) private _holderRequests;
    mapping(string => FileInfo) private _files;
    mapping(bytes32 => string) private _metaFileHashToFileHash;
    mapping(string => string) private _idToFileHash;
    mapping(address => string[]) private _holderFiles;

    event PermissionRequested(string indexed fileId, address indexed holder, address indexed requester, uint256 duration);
    event PermissionRequestHandled(string indexed fileId, address indexed holder, address indexed requester, bool granted);
    event FileUploaded(string indexed fileHash, address indexed holder);
    event PermissionGranted(string indexed fileHash, address indexed requester, uint256 expirationTime);

    error NotOwner();
    error FileExists();
    error FileMissing();
    error NotFileHolder();
    error NoValidPermission();
    error RequestNotFound();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    function uploadFile(FileUploadParams calldata params) external {
        if (bytes(_files[params.fileHash].fileHash).length != 0) revert FileExists();

        FileInfo storage fileInfo = _files[params.fileHash];
        fileInfo.fileHash = params.fileHash;
        fileInfo.metadataHash = params.metadataHash;
        fileInfo.holder = params.holder;
        fileInfo.fileName = params.fileName;

        _metaFileHashToFileHash[params.metadataHash] = params.fileHash;
        _idToFileHash[params.id] = params.fileHash;
        _holderFiles[params.holder].push(params.id);

        emit FileUploaded(params.fileHash, params.holder);
    }

    function verifyFileByMetaHash(bytes32 _metadataHash) external view returns (bool exists) {
        exists = bytes(_metaFileHashToFileHash[_metadataHash]).length != 0;
    }

    function grantPermissionToFileInfo(string calldata _id, address _requester, uint256 _duration) internal {
        string storage fileHash = _idToFileHash[_id];
        if (bytes(fileHash).length == 0) revert FileMissing();

        FileInfo storage fileInfo = _files[fileHash];
        uint256 expirationTime = block.timestamp + _duration;
        fileInfo.permissionExpirations[_requester] = expirationTime;

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

    function getFileInfoById(string calldata _id) external view returns (FileInfoView memory info) {
        string storage fileHash = _idToFileHash[_id];
        if (bytes(fileHash).length == 0) revert FileMissing();

        FileInfo storage fileInfo = _files[fileHash];

        if (msg.sender != fileInfo.holder) {
            if (!hasValidPermission(fileInfo, msg.sender)) revert NoValidPermission();
        }

        info = FileInfoView({
            fileHash: fileInfo.fileHash,
            fileName: fileInfo.fileName,
            metadataHash: fileInfo.metadataHash,
            holder: fileInfo.holder
        });
    }

    function getHolderFileInfos(address _holder) external view returns (FileIdName[] memory result) {
        string[] storage fileIds = _holderFiles[_holder];
        uint256 length = fileIds.length;

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

    function hasValidPermission(FileInfo storage fileInfo, address requester) internal view returns (bool isValid) {
        uint256 expirationTime = fileInfo.permissionExpirations[requester];
        isValid = expirationTime > block.timestamp;
    }

    function requestPermission(string calldata _fileId, string calldata _fileName, address _holder, uint256 _duration) external {
        if (bytes(_idToFileHash[_fileId]).length == 0) revert FileMissing();

        PermissionRequest memory newRequest = PermissionRequest({
            fileId: _fileId,
            requester: msg.sender,
            duration: _duration,
            fileName: _fileName
        });

        _holderRequests[_holder].push(newRequest);

        emit PermissionRequested(_fileId, _holder, msg.sender, _duration);
    }

    function getPendingRequests(address _holder) external view returns (PermissionRequest[] memory pendingRequests) {
        PermissionRequest[] storage allRequests = _holderRequests[_holder];
        uint256 length = allRequests.length;

        pendingRequests = new PermissionRequest[](length);

        for (uint256 i = 0; i < length; ) {
            pendingRequests[i] = allRequests[i];
            unchecked { ++i; }
        }
    }

    function handlePermissionRequest(string calldata _fileId, address _requester, bool _granted) external {
        if (bytes(_idToFileHash[_fileId]).length == 0) revert FileMissing();
        FileInfo storage fileInfo = _files[_idToFileHash[_fileId]];
        if (msg.sender != fileInfo.holder) revert NotFileHolder();

        PermissionRequest[] storage requests = _holderRequests[msg.sender];
        uint256 length = requests.length;

        for (uint256 i = 0; i < length; ) {
            PermissionRequest storage request = requests[i];
            if (
                keccak256(abi.encodePacked(request.fileId)) == keccak256(abi.encodePacked(_fileId)) &&
                request.requester == _requester
            ) {
                if (_granted) {
                    grantPermissionToFileInfo(_fileId, _requester, request.duration);
                }
                emit PermissionRequestHandled(_fileId, msg.sender, _requester, _granted);

                // Remove the request by shifting the elements
                if (i != length - 1) {
                    requests[i] = requests[length - 1]; // Move the last element to the current index
                }
                requests.pop(); // Remove the last element

                return;
            }
            unchecked { ++i; }
        }

        revert RequestNotFound();
    }
}
