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

    const ERC20 = await ethers.getContractFactory("GenericERC20");
    token = await ERC20.deploy("Paymaster token", "PAY")
    await token.deployed();
    console.log("Token deployed to:", token.address);
    await token.mint(deployer.address, ethers.utils.parseEther("100"));
    const GasTank = await ethers.getContractFactory("GasTank");
    gasTank = await GasTank.deploy(token.address);
    await gasTank.deployed();
    console.log("GasTank deployed to:", gasTank.address);

    //verification
    await hre.run("verify:verify", {
        address: token.address,
        constructorArguments: ["Paymaster token", "PAY"],
    });

    await hre.run("verify:verify", {
        address: gasTank.address,
        constructorArguments: [token.address],
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
