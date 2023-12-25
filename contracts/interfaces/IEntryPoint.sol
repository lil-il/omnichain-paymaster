/**
 ** Account-Abstraction (EIP-4337) singleton EntryPoint implementation.
 ** Only one instance required on each chain.
 **/
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "./UserOperation.sol";

interface IEntryPoint  {

    event UserOperationEvent(address indexed sender, address indexed paymaster, uint256 nonce, bool success);

    function handleOp(UserOperation calldata op) external;

    function getRequestId(UserOperation calldata userOp) external view returns (bytes32);

}