const {ethers} = require("hardhat");


function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
      "Deploying contracts with the account:",
      deployer.address
  );

    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    const txCost = ethers.utils.parseEther("0.0001");
    const entryPoint = await EntryPoint.deploy(txCost);
    await entryPoint.deployed();
    console.log("EntryPoint deployed to:", entryPoint.address);

    const Paymaster = await ethers.getContractFactory("VerifyingPaymaster");
    paymaster = await Paymaster.deploy(entryPoint.address, "0xc34b8E12e8347778EE8C94cC9BddeD08cd760AD8");
    await paymaster.deployed();
    console.log("Paymaster deployed to:", paymaster.address);


    await deployer.sendTransaction({
        to: paymaster.address,
        value: ethers.utils.parseEther("0.05")
    });

    const Wallet = await ethers.getContractFactory("SmartWallet");
    smartWallet = await Wallet.deploy(entryPoint.address, deployer.address);
    await smartWallet.deployed();
    console.log("smartWallet deployed to:", smartWallet.address);

    await deployer.sendTransaction({
        to: smartWallet.address,
        value: ethers.utils.parseEther("0.001")
    });

    //verification
    await hre.run("verify:verify", {
        address: entryPoint.address,
        constructorArguments: [txCost],
    });

    await hre.run("verify:verify", {
        address: paymaster.address,
        constructorArguments: [entryPoint.address, "0xc34b8E12e8347778EE8C94cC9BddeD08cd760AD8"],
    });

    await hre.run("verify:verify", {
        address: smartWallet.address,
        constructorArguments: [entryPoint.address, deployer.address],
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
