import bs58 from 'bs58'
import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import crypto from 'crypto'
import { makeSignDoc as makeSignDocAmino, serializeSignDoc } from '@cosmjs/amino'
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto'
import { fromBase64, toBase64 } from '@cosmjs/encoding'

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
    if (network === 'cosmos') {
      const msg = {
        type: 'sign/MsgSignData',
        value: {
          data: originalMessage,
        },
      }
      const secpSignature = Secp256k1Signature.fromFixedLength(fromBase64(signedMessage))
      const signBytes = serializeSignDoc(
        makeSignDocAmino(
          [msg],
          {
            gas: '0',
            amount: [],
          },
          'coreum-mainnet-1',
          '',
          0,
          0,
        ),
      )
      const prehashed = sha256(signBytes)
      const rawSecp256k1Pubkey = hexToUint8Array(usersPublicKey)
      const isVerified = await Secp256k1.verifySignature(secpSignature, prehashed, rawSecp256k1Pubkey)
      return isVerified
    }
    return false
  } catch {
    return false
  }
}
