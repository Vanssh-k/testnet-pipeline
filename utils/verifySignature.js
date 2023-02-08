const bs58 = require('bs58')
const ethers = require('ethers')
const nacl = require('tweetnacl')

module.exports = (usersPublicKey, originalMessage, signedMessage, network) => {
    try {
        if (network === 'evm') {
            const sig = ethers.utils.splitSignature(signedMessage)
            const publicKeyToVerify = ethers.utils
                .verifyMessage(originalMessage, sig)
                .toLowerCase()
            if (usersPublicKey.toLowerCase() === publicKeyToVerify) {
                return true
            }
            return false
        }
        const verified = nacl.sign.detached.verify(
            new TextEncoder().encode(originalMessage),
            bs58.decode(signedMessage),
            bs58.decode(usersPublicKey)
        )
        // check response data type of verified
        return verified
    } catch {
        return false
    }
}
