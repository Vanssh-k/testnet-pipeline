const web3 = require('web3')
const solanaWeb3 = require('@solana/web3.js')

module.exports = (value) => {
    try {
        // EVM Check
        if (web3.utils.isAddress(value?.toLowerCase())) {
            return 'evm'
        }

        // Solana Check
        const pub = new solanaWeb3.PublicKey(value)
        if (solanaWeb3.PublicKey.isOnCurve(pub)) {
            return 'solana'
        }

        return null
    } catch (error) {
        return null
    }
}
