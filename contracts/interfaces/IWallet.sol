pragma solidity ^0.8.12;

import "./UserOperation.sol";

interface IWallet {

    function validateUserOp(UserOperation calldata userOp, bytes32 requestId) external;

    function execFromEntryPoint(address dest, uint256 value, bytes calldata func) external;
}