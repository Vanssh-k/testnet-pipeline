import bs58 from 'bs58'
import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import crypto from 'crypto'
import { makeSignDoc as makeSignDocAmino, serializeSignDoc } from '@cosmjs/amino'
import { Secp256k1, Secp256k1Signature, sha256, ripemd160 } from '@cosmjs/crypto'
import { fromBase64, toBech32 } from '@cosmjs/encoding'

function hexToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
}

function pubkeyToAddress(pubkey: string) {
  const rawSecp256k1Pubkey = hexToUint8Array(pubkey)
  return toBech32('core', ripemd160(sha256(rawSecp256k1Pubkey)))
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
      //cosmostation
      //chain_id: chainId,

      //kepler & leap
      //chain_id: "",

      let success = false
      let attempt = 0
      const signer = pubkeyToAddress(usersPublicKey);

      do {
        const signed = {
          account_number: '0',
          chain_id: attempt === 0 ? 'coreum-mainnet-1' : '',
          fee: {
            amount: [
              {
                denom: 'ucore',
                amount: '0',
              },
            ],
            gas: '0',
          },
          memo: '',
          msgs: [
            {
              type: 'sign/MsgSignData',
              value: {
                data: Buffer.from('message').toString('base64'),
                signer: signer,
              },
            },
          ],
          sequence: '0',
        }
        const success = await Secp256k1.verifySignature(
          Secp256k1Signature.fromFixedLength(fromBase64(signedMessage)),
          sha256(serializeSignDoc(signed)),
          hexToUint8Array(usersPublicKey)
        );
        if (success) break;
      } while (!success && attempt < 2)

      return success
    }
    return false
  } catch {
    return false
  }
}
