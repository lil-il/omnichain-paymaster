// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "./interfaces/IWallet.sol";
import "./interfaces/IEntryPoint.sol";

/**
 * Basic wallet implementation.
 * this contract provides the basic logic for implementing the IWallet interface  - validateUserOp
 * specific wallet implementation should inherit it and provide the wallet-specific logic
 */
abstract contract BaseWallet is IWallet {
    using UserOperationLib for UserOperation;

    /**
     * return the wallet nonce.
     * subclass should return a nonce value that is used both by _validateAndUpdateNonce, and by the external provider (to read the current nonce)
     */
    function nonce() public view virtual returns (uint256);

    /**
     * return the entryPoint used by this wallet.
     * subclass should return the current entryPoint used by this wallet.
     */
    function entryPoint() public view virtual returns (IEntryPoint);


    /**
     * validate the current nonce matches the UserOperation nonce.
     * then it should update the wallet's state to prevent replay of this UserOperation.
     * called only if initCode is empty (since "nonce" field is used as "salt" on wallet creation)
     * @param userOp the op to validate.
     */
    function _validateAndUpdateNonce(UserOperation calldata userOp) internal virtual;


    /**
     * expose an api to modify the entryPoint.
     * must be called by current "admin" of the wallet.
     * @param newEntryPoint the new entrypoint to trust.
     */
    function updateEntryPoint(address newEntryPoint) external {
        _requireFromAdmin();
        _updateEntryPoint(newEntryPoint);
    }

    /**
     * ensure the caller is allowed "admin" operations (such as changing the entryPoint)
     * default implementation trust the wallet itself (or any signer that passes "validateUserOp")
     * to be the "admin"
     */
    function _requireFromAdmin() internal view virtual {
        require(msg.sender == address(this) || msg.sender == address(entryPoint()), "not admin");
    }

    /**
     * update the current entrypoint.
     * subclass should override and update current entrypoint
     */
    function _updateEntryPoint(address) internal virtual;
}