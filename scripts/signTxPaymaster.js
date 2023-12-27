const {ethers} = require("hardhat");


function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function main() {
    let privateKeyPaymaster =
        "";
    walletPaymaster = new ethers.Wallet(privateKeyPaymaster);
    signerPaymaster = new ethers.utils.SigningKey(privateKeyPaymaster);


    const hashPaymaster = "0xADAEDFF382B1EE90BBBEFC8B5BEF8F66CB007683C163C38949DD8D0ABC61C3E7";
    let signaturePaymaster = signerPaymaster.signDigest(hashPaymaster);
    let signatureFlatPaymaster = ethers.utils.joinSignature(signaturePaymaster);
    let paymasterData = "0xa8758E46bc5F6b0BAd661fbbfA03f9494abABE17" + signatureFlatPaymaster.slice(2);
    console.log(paymasterData)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
