const {ethers} = require("hardhat");


function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function main() {

    let privateKeyPaymaster =
        "";
    walletPaymaster = new ethers.Wallet(privateKeyPaymaster);
    signerPaymaster = new ethers.utils.SigningKey(privateKeyPaymaster);

    const hashPaymaster = "0xa985cba5a05b4425cd1d44bafbe49756ec79b02b147be92b5d3d5d4f789727c9";
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
