
pragma solidity ^0.8.12;


import "./interfaces/IWallet.sol";
import "./interfaces/IPaymaster.sol";

import "./interfaces/IEntryPoint.sol";

import "hardhat/console.sol";

contract EntryPoint is IEntryPoint {
    using UserOperationLib for UserOperation;
    uint256 txCost;

    constructor(uint256 _txCost){
        txCost = _txCost;
    }


    function _executeUserOp(UserOperation calldata userOp) private {
        IWallet(userOp.sender).execFromEntryPoint(userOp.to, userOp.value, userOp.callData);
    }

    function handleOp(UserOperation calldata userOp) public {
        _validatePrepayment(userOp);
        address paymaster = address(bytes20(userOp.paymasterAndData[: 20]));
        IPaymaster(paymaster).returnGas(txCost, msg.sender);
        _executeUserOp(userOp);
    }


    function _validatePrepayment(UserOperation calldata userOp) private {
        address sender = userOp.sender;
        bytes32 requestId = getRequestId(userOp);
        IWallet(sender).validateUserOp(userOp, requestId);

        address paymaster = address(bytes20(userOp.paymasterAndData[: 20]));
        require(address(paymaster).balance >= txCost, "Insufficient paymaster balance");
        IPaymaster(paymaster).validatePaymasterUserOp(userOp);
    }

    function getRequestId(UserOperation calldata userOp) public view returns (bytes32) {
        return keccak256(abi.encode(userOp.sender, userOp.nonce, userOp.to, userOp.callData, userOp.value, userOp.paymasterAndData, address(this), block.chainid));
    }
}