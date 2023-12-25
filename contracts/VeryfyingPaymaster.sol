// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./interfaces/UserOperation.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract VerifyingPaymaster  {
    address public immutable verifyingSigner;
    address public immutable entryPoint;

    constructor(address _entryPoint, address _verifyingSigner)  {
        verifyingSigner = _verifyingSigner;
        entryPoint = _entryPoint;
    }

    function getHash(UserOperation calldata userOp)
    public view returns (bytes32) {
        return
        keccak256(
            abi.encode(
                userOp.sender,
                userOp.nonce,
                userOp.to,
                keccak256(userOp.callData),
                block.chainid,
                address(this)
            )
        );
    }


    function validatePaymasterUserOp(UserOperation calldata userOp)
    public view returns (bool) {
        require (msg.sender == entryPoint, "VerifyingPaymaster: Only entryPoint can call");
        bytes calldata signature = parsePaymasterAndData(userOp.paymasterAndData);
        require(signature.length == 64 || signature.length == 65, "VerifyingPaymaster: invalid signature length in paymasterAndData");
        bytes32 hash = getHash(userOp);

        require(verifyingSigner == ECDSA.recover(hash, signature), "Paymaster: wrong signature");
        return true;
    }

    function returnGas(uint256 amount, address beneficiary) external {
        require (msg.sender == entryPoint, "VerifyingPaymaster: Only entryPoint can call");
        (bool sent, ) = beneficiary.call{value: amount}("");
        require(sent, "Paymaster: Failed to send Ether");
    }

    function parsePaymasterAndData(bytes calldata paymasterAndData) public pure returns(bytes calldata signature) {
        signature = paymasterAndData[20:];
    }

    receive() external payable {}
}