import "./interfaces/UserOperation.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.12;

contract GasTank {
    IERC20 public token;

    event PayedForUserOp(bytes32 hash, uint256 amount);

    constructor(IERC20 _token) {
        token = _token;
    }

    function payForUserOp(UserOperation calldata userOp, uint256 chainID, uint256 amount, address paymaster) external {
        token.transferFrom(msg.sender, address(this), amount);
        emit PayedForUserOp(getHash(userOp, chainID, paymaster), amount);
    }

    function getHash(UserOperation calldata userOp, uint256 chainID, address paymaster) public view returns (bytes32) {
        return
        keccak256(
            abi.encode(
                userOp.sender,
                userOp.nonce,
                userOp.to,
                keccak256(userOp.callData),
                chainID,
                paymaster
            )
        );
    }
}