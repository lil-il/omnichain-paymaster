const {ethers} = require("hardhat");
require("dotenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function main() {
    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    let entryPoint = await EntryPoint.attach("0xC45b9ADaaD34cB8817C3644084B44252beeB4b3c")
    const userOperationPaymaster = {
        sender: "0xbdFE617AdF2Ee4B18Cb89d34938956B47838E974",
        nonce: 1,
        to: "0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa",
        callData: "0xd0e30db0",
        value: ethers.utils.parseEther("0.001"),
        paymasterAndData: "0xa8758E46bc5F6b0BAd661fbbfA03f9494abABE173aece8824b0b5cd25f9c3240504cda81a768274d6dc4c28e41d78f789e23cfc46e83901ae543c2e744f8756465a326564bfbdf0bf361ca3da2c2c8526cd5936a1c",
        signature: "0x",
    }

    const hash = await entryPoint.getRequestId(userOperationPaymaster);
    let privateKey =
        PRIVATE_KEY;
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
