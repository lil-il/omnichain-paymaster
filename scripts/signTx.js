const {ethers} = require("hardhat");


function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function main() {
    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    let entryPoint = await EntryPoint.attach("0xC45b9ADaaD34cB8817C3644084B44252beeB4b3c")
    const userOperationPaymaster = {
        sender: "0xbdFE617AdF2Ee4B18Cb89d34938956B47838E974",
        nonce: 0,
        to: "0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa",
        callData: "0xd0e30db0",
        value: ethers.utils.parseEther("0.01"),
        paymasterAndData: "0xa8758E46bc5F6b0BAd661fbbfA03f9494abABE177cce229cf88d96b2568bbaa74479ca1d59b802debc0acff90c239a040427e49532b5b2a9ef9bfa169b73e4cec4f73d4e56ef9d02f838b390c0e76fa4e75f9b031b",
        signature: "0x",
    }

    const hash = await entryPoint.getRequestId(userOperationPaymaster);
    let privateKey =
        "";
    wallet = new ethers.Wallet(privateKey);
    signer = new ethers.utils.SigningKey(privateKey);

    let signature = signer.signDigest(hash);
    let signatureFlat = ethers.utils.joinSignature(signature);
    console.log(signatureFlat)

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
