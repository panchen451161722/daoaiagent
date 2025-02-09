// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DAOAIAgent.sol"; // 确保DAOAIAgent.sol文件存在并且路径正确

contract DAOFactory {
    event DAOCreated(address indexed daoAddress, address creator, uint256 timestamp);

    function createDAO(address _tokenContractAddress, bool _allowIndependentAIA, bytes32 _otherContentHash) external {
        DAOAIAgent newDao = new DAOAIAgent(_tokenContractAddress, _allowIndependentAIA, _otherContentHash);
        emit DAOCreated(address(newDao), msg.sender, block.timestamp);
    }
}
