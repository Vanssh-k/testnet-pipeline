import { ethers } from 'ethers'
import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

test('Verify Signer and Access Token: POST /verify_signer', async () => {
  const verificationMessage = JSON.parse(
    (
      await supertest(app).get(
        '/api/auth/get_message?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5160'
      )
    ).text
  )
  const signer = new ethers.Wallet(config.test_wallet2_private_key)
  const signedMessage = await signer.signMessage(verificationMessage)
  const data = {
    publicKey: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160',
    signedMessage: signedMessage,
  }

  const token = JSON.parse(
    (await supertest(app).post('/api/auth/verify_signer').send(data)).text
  )
  expect(typeof token.accessToken).toBe('string')
  expect(typeof token.refreshToken).toBe('string')

  const tokenVerification = JSON.parse(
    (
      await supertest(app)
        .get('/api/auth/verify_access_token')
        .set('Authorization', `Bearer ${token.accessToken}`)
    ).text
  )
  expect(typeof tokenVerification.publicKey).toBe('string')

  const newToken = JSON.parse(
    (
      await supertest(app)
        .get('/api/auth/refresh_access_token')
        .set('Authorization', `Bearer ${token.refreshToken}`)
    ).text
  )
  expect(typeof newToken.accessToken).toBe('string')
}, 10000)

test('Verify Signer Unauthorized Case: POST /verify_signer', async () => {
  const data = {
    publicKey: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160',
    signedMessage: 'signedMessage',
  }

  await supertest(app).post('/api/auth/verify_signer').send(data).expect(401)
}, 10000)

test('Verify Access Token Unauthorized Case: POST /verify_access_token', async () => {
  await supertest(app)
    .get('/api/auth/verify_access_token')
    .set('Authorization', 'Bearer ' + 'blablabla')
    .expect(401)
}, 10000)
