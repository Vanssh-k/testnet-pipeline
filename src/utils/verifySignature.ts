import bs58 from 'bs58'
import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import crypto from 'crypto'
import secp256k1 from 'secp256k1'

function hexToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
}

export default async (
  usersPublicKey: string,
  originalMessage: string,
  signedMessage: string,
  network: string,
): Promise<boolean> => {
  try {
    if (network === 'evm') {
      const publicKeyToVerify = ethers.verifyMessage(originalMessage, signedMessage).toLowerCase()
      if (usersPublicKey.toLowerCase() === publicKeyToVerify) {
        return true
      }
      return false
    }
    if (network === 'solana') {
      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(originalMessage),
        bs58.decode(signedMessage),
        bs58.decode(usersPublicKey),
      )
      return verified
    }
    if (network === 'coreum') {
      const messageBuffer = Buffer.from(originalMessage, 'utf8')
      const hash = crypto.createHash('sha256').update(messageBuffer).digest()
      const formattedSignature = hexToUint8Array(signedMessage)
      const formatedPubkey = hexToUint8Array(usersPublicKey)
      const isVerified = secp256k1.ecdsaVerify(formattedSignature, hash, formatedPubkey)
      return isVerified
    }
    return false
  } catch {
    return false
  }
}
