const {ethers} = require("hardhat");


function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function main() {
    [deployer] = await ethers.getSigners();
    await deployer.sendTransaction({
        to: "0xbdFE617AdF2Ee4B18Cb89d34938956B47838E974",
        value: ethers.utils.parseEther("0.05")
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
