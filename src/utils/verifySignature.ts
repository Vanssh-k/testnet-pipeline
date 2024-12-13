import bs58 from 'bs58'
import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import crypto from 'crypto'
import { makeSignDoc as makeSignDocAmino, serializeSignDoc } from '@cosmjs/amino'
import { Secp256k1, Secp256k1Signature, sha256, ripemd160 } from '@cosmjs/crypto'
import { fromBase64, toBech32 } from '@cosmjs/encoding'
import { Rola } from '@radixdlt/rola'
import { ResultAsync } from 'neverthrow'
import config from '../config/index.js'

function hexToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
}

function pubkeyToAddress(pubkey: string) {
  const rawSecp256k1Pubkey = hexToUint8Array(pubkey)
  return toBech32('core', ripemd160(sha256(rawSecp256k1Pubkey)))
}

const { verifySignedChallenge } = Rola({
  applicationName: config.radixApplicationName,
  dAppDefinitionAddress: config.radixDappDefination, // address of the dApp definition
  networkId: config.radixNetworkId, // network id of the Radix network
  expectedOrigin: config.radixExpectedOrigin, // origin of the client making the wallet request
})

export default async (
  usersPublicKey: string,
  originalMessage: string,
  signedMessage: any,
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
      let success = false
      let attempt = 0
      const signer = pubkeyToAddress(usersPublicKey)
      do {
        //kepler (attempt 1) -> chain_id = "" & fee.amount = []
        //cosmostation -> chain_id = coreum-mainnet-1 & fee.amount = [{ amount: "0", denom: "ucore" }]
        //leap (attempt 2) -> chain_id = "" & fee.amount = [{ amount: "0", denom: "ucore" }]

        const signed = {
          chain_id: attempt === 0 ? 'coreum-mainnet-1' : '',
          account_number: '0',
          sequence: '0',
          fee: {
            amount:
              attempt === 0
                ? [{ amount: '0', denom: 'ucore' }]
                : attempt === 2
                  ? [{ amount: '0', denom: 'ucore' }]
                  : [],
            gas: '0',
          },
          msgs: [
            {
              type: 'sign/MsgSignData',
              value: {
                signer: signer,
                data: Buffer.from(originalMessage).toString('base64'),
              },
            },
          ],
          memo: '',
        }
        success = await Secp256k1.verifySignature(
          Secp256k1Signature.fromFixedLength(fromBase64(signedMessage)),
          sha256(serializeSignDoc(signed)),
          hexToUint8Array(usersPublicKey),
        )
        if (success) break
        attempt++
      } while (!success && attempt < 3)
      return success
    }
    if (network === 'radix') {
      const challenges = JSON.parse(signedMessage)
      const result = await ResultAsync.combine(
        challenges.map((signedChallenge: any) => verifySignedChallenge(signedChallenge)),
      )
      if (result.isErr()) {
        return false
      } else {
        return true
      }
    }
    return false
  } catch {
    return false
  }
}
