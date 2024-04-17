import { ethers } from 'ethers'
import app from '../../../app.js'
import supertest from 'supertest'
import config from '../../../config/index.js'

const publicKey = '0x487fc2fE07c593EAb555729c3DD6dF85020B5160'
const testWalletPrivateKey = config.test_wallet2_private_key

async function getVerificationMessage() {
  const response = await supertest(app).get(`/api/auth/get_message?publicKey=${publicKey}`)
  return JSON.parse(response.text)
}

async function getSignedMessage(verificationMessage: string) {
  const signer = new ethers.Wallet(testWalletPrivateKey)
  return signer.signMessage(verificationMessage)
}

async function getTokens(signedMessage: string) {
  const data = {
    publicKey,
    signedMessage,
  }
  const response = await supertest(app).post('/api/auth/verify_signer').send(data)
  return JSON.parse(response.text)
}

test('Verify Signer and Access Token: POST /verify_signer', async () => {
  const verificationMessage = await getVerificationMessage()
  const signedMessage = await getSignedMessage(verificationMessage)
  const { accessToken } = await getTokens(signedMessage)

  expect(typeof accessToken).toBe('string')
}, 10000)

test('Verify Signer Unauthorized Case: POST /verify_signer', async () => {
  const data = {
    publicKey,
    signedMessage: 'signedMessage',
  }

  await supertest(app).post('/api/auth/verify_signer').send(data).expect(401)
}, 10000)

test('Verify Access Token Unauthorized Case: POST /verify_access_token', async () => {
  await supertest(app).get('/api/auth/verify_access_token').set('Authorization', 'Bearer blablabla').expect(401)
}, 10000)

test('Verify User Signature: POST /verify_signer', async () => {
  const verificationMessage = await getVerificationMessage()
  const signedMessage = await getSignedMessage(verificationMessage)
  const data = {
    publicKey,
    signedMessage,
  }
  const response = await supertest(app).post('/api/auth/verify_signer').send(data)
  const jsonRes = JSON.parse(response.text)
  expect(typeof jsonRes.publicKey).toBe('string')
}, 10000)
