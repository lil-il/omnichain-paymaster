const { expect } = require("chai");
const { constants } = require("ethers");
const { ethers } = require("hardhat");

const hardhatChainID = 31337;

describe("Test", function () {
  let entryPoint, smartWallet, wallet, signer, walletPaymaster, signerPaymaster, paymaster, token, gasTank;
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    let privateKey =
        "0x0123456789012345678901234567890123456789012345678901234567890123";
    wallet = new ethers.Wallet(privateKey);
    signer = new ethers.utils.SigningKey(privateKey);

    let privateKeyPaymaster =
        "0xfc45d2985e8af3ad8ffa82793ee3c875f6a638e78c77b90e5a1596531f503659";
    walletPaymaster = new ethers.Wallet(privateKeyPaymaster);
    signerPaymaster = new ethers.utils.SigningKey(privateKeyPaymaster);

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    const txCost = ethers.utils.parseEther("0.001");
    entryPoint = await EntryPoint.deploy(txCost);
    await entryPoint.deployed();
    console.log("EntryPoint deployed to:", entryPoint.address);

    const Paymaster = await ethers.getContractFactory("VerifyingPaymaster");
    paymaster = await Paymaster.deploy(entryPoint.address, walletPaymaster.address);
    console.log("Paymaster deployed to:", paymaster.address);

    await deployer.sendTransaction({
          to: paymaster.address,
          value: ethers.utils.parseEther("1")
      });

    const Wallet = await ethers.getContractFactory("SmartWallet");
    smartWallet = await Wallet.deploy(entryPoint.address, wallet.address);
    await smartWallet.deployed();

    await deployer.sendTransaction({
      to: smartWallet.address,
      value: ethers.utils.parseEther("1")
    });

    const ERC20 = await ethers.getContractFactory("GenericERC20");
    token = await ERC20.deploy("Paymaster token", "PAY")
    await token.mint(deployer.address, ethers.utils.parseEther("100"));
    const GasTank = await ethers.getContractFactory("GasTank");
    gasTank = await GasTank.deploy(token.address);
  });
  it("test", async function () {
    const Weth = await ethers.getContractFactory("WETH9");
    const weth = await Weth.deploy();

    const iface = new ethers.utils.Interface([
      "function deposit()",
    ])
    const calldata = iface.encodeFunctionData("deposit");
    console.log(calldata)

    const userOperation = {
      sender: smartWallet.address,
      nonce: 0,
      to: weth.address,
      callData: calldata,
      value: ethers.utils.parseEther("0.1"),
      paymasterAndData: paymaster.address,
      signature: "0x",
    }
    await token.approve(gasTank.address, ethers.utils.parseEther("10"));
    let gasTankTx = await gasTank.payForUserOp(userOperation, hardhatChainID, ethers.utils.parseEther("10"));

    const hashPaymaster = await paymaster.getHash(userOperation);

    let signaturePaymaster = signerPaymaster.signDigest(hashPaymaster);
    let signatureFlatPaymaster = ethers.utils.joinSignature(signaturePaymaster);
    let paymasterData = paymaster.address + signatureFlatPaymaster.slice(2);

    const userOperationPaymaster = {
      sender: smartWallet.address,
      nonce: 0,
      to: weth.address,
      callData: calldata,
      value: ethers.utils.parseEther("0.1"),
      paymasterAndData: paymasterData,
      signature: "0x",
    }

    const hash = await entryPoint.getRequestId(userOperationPaymaster);

    let signature = signer.signDigest(hash);
    let signatureFlat = ethers.utils.joinSignature(signature);

    const userOperationSigned = {
      sender: smartWallet.address,
      nonce: 0,
      to: weth.address,
      callData: calldata,
      value: ethers.utils.parseEther("0.1"),
      paymasterAndData: paymasterData,
      signature: signatureFlat,
    }
    await entryPoint.handleOp(userOperationSigned);
    console.log(await weth.balanceOf(smartWallet.address))
  });
});
