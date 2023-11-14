import { ethers } from 'ethers'
import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

const publicKey = '0x487fc2fE07c593EAb555729c3DD6dF85020B5160'
const testWalletPrivateKey = config.test_wallet2_private_key

async function getVerificationMessage() {
  const response = await supertest(app).get(
    `/api/auth/get_message?publicKey=${publicKey}`
  )
  return JSON.parse(response.text)
}

async function getSignedMessage(verificationMessage) {
  const signer = new ethers.Wallet(testWalletPrivateKey)
  return signer.signMessage(verificationMessage)
}

async function getTokens(signedMessage) {
  const data = {
    publicKey,
    signedMessage,
  }
  const response = await supertest(app)
    .post('/api/auth/verify_signer')
    .send(data)
  return JSON.parse(response.text)
}

async function verifyToken(token) {
  const response = await supertest(app)
    .get('/api/auth/verify_access_token')
    .set('Authorization', `Bearer ${token}`)
  return JSON.parse(response.text)
}

async function refreshAccessToken(refreshToken) {
  const response = await supertest(app)
    .get('/api/auth/refresh_access_token')
    .set('Authorization', `Bearer ${refreshToken}`)
  return JSON.parse(response.text)
}

test('Verify Signer and Access Token: POST /verify_signer', async () => {
  const verificationMessage = await getVerificationMessage()
  const signedMessage = await getSignedMessage(verificationMessage)
  const { accessToken, refreshToken } = await getTokens(signedMessage)

  expect(typeof accessToken).toBe('string')
  expect(typeof refreshToken).toBe('string')

  const tokenVerification = await verifyToken(accessToken)
  expect(typeof tokenVerification.publicKey).toBe('string')

  const newToken = await refreshAccessToken(refreshToken)
  expect(typeof newToken.accessToken).toBe('string')
}, 10000)

test('Verify Signer Unauthorized Case: POST /verify_signer', async () => {
  const data = {
    publicKey,
    signedMessage: 'signedMessage',
  }

  await supertest(app).post('/api/auth/verify_signer').send(data).expect(401)
}, 10000)

test('Verify Access Token Unauthorized Case: POST /verify_access_token', async () => {
  await supertest(app)
    .get('/api/auth/verify_access_token')
    .set('Authorization', 'Bearer blablabla')
    .expect(401)
}, 10000)
