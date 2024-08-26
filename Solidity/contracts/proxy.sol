// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerifierProxy {
    address public implementation;
    address public owner;

    event ImplementationUpdated(address indexed newImplementation);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(address _implementation) {
        implementation = _implementation;
        owner = msg.sender;
    }

    function updateImplementation(address _newImplementation) external onlyOwner {
        require(_newImplementation != address(0), "New implementation cannot be zero address");
        implementation = _newImplementation;
        emit ImplementationUpdated(_newImplementation);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    fallback() external payable {
        _delegate(implementation);
    }

    receive() external payable {
        _delegate(implementation);
    }

    function _delegate(address _implementation) internal {
        assembly {
            // Load the free memory pointer
            let ptr := mload(0x40)
            
            // Copy the calldata into memory
            calldatacopy(ptr, 0, calldatasize())
            
            // Delegatecall to the implementation
            let result := delegatecall(gas(), _implementation, ptr, calldatasize(), 0, 0)
            
            // Copy the returned data
            returndatacopy(ptr, 0, returndatasize())
            
            // Handle the delegatecall result
            switch result
            case 0 { revert(ptr, returndatasize()) }
            default { return(ptr, returndatasize()) }
        }
    }
}
