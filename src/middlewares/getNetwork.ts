import web3 from 'web3'
import solanaWeb3 from '@solana/web3.js'
import { CustomError } from '../errors'

export default (value: string) => {
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

        throw new CustomError('Invaild Address', 400, 'Invalid Address')
    } catch (error) {
        throw new CustomError('Invaild Address', 400, 'Invalid Address')
    }
}
