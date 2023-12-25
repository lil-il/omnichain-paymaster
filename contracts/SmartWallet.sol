import "./BaseWallet.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";


contract SmartWallet is BaseWallet {
    using ECDSA for bytes32;

    //explicit sizes of nonce, to fit a single storage cell with "owner"
    uint96 private _nonce;
    address public owner;

    function nonce() public view virtual override returns (uint256) {
        return _nonce;
    }

    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    IEntryPoint private _entryPoint;

    event EntryPointChanged(address indexed oldEntryPoint, address indexed newEntryPoint);

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    constructor(IEntryPoint anEntryPoint, address anOwner) {
        _entryPoint = anEntryPoint;
        owner = anOwner;
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 requestId)
    external {
        _requireFromEntryPoint();
        _validateAndUpdateNonce(userOp);
        _validateSignature(userOp, requestId);
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the entryPoint (which gets redirected through execFromEntryPoint)
        require(msg.sender == owner || msg.sender == address(this), "only owner");
    }

    /**
     * transfer eth value to a destination address
     */
    function transfer(address payable dest, uint256 amount) external onlyOwner {
        dest.transfer(amount);
    }

    /**
     * execute a transaction (called directly from owner, not by entryPoint)
     */
    function exec(address dest, uint256 value, bytes calldata func) external onlyOwner {
        _call(dest, value, func);
    }

    /**
     * execute a sequence of transaction
     */
    function execBatch(address[] calldata dest, bytes[] calldata func) external onlyOwner {
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
        }
    }

    /**
     * change entry-point:
     * a wallet must have a method for replacing the entryPoint, in case the the entryPoint is
     * upgraded to a newer version.
     */
    function _updateEntryPoint(address newEntryPoint) internal override {
        emit EntryPointChanged(address(_entryPoint), newEntryPoint);
        _entryPoint = IEntryPoint(payable(newEntryPoint));
    }

    function _requireFromAdmin() internal view override {
        _onlyOwner();
    }

    function _requireFromEntryPoint() internal view {
        require(msg.sender == address(entryPoint()), "wallet: not from EntryPoint");
    }

    // called by entryPoint, only after validateUserOp succeeded.
    function execFromEntryPoint(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPoint();
        _call(dest, value, func);
    }

    /// implement template method of BaseWallet
    function _validateAndUpdateNonce(UserOperation calldata userOp) internal override {
        require(_nonce++ == userOp.nonce, "wallet: invalid nonce");
    }

    /// implement template method of BaseWallet
    function _validateSignature(UserOperation calldata userOp, bytes32 requestId)
    internal virtual  {
        require(owner == ECDSA.recover(requestId, userOp.signature), "wallet: wrong signature");
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        require (success);
    }
}