// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./UserOperation.sol";


interface IPaymaster {


    function validatePaymasterUserOp(UserOperation calldata userOp)
    external;


    function returnGas(uint256 amount, address beneficiary) external;
}