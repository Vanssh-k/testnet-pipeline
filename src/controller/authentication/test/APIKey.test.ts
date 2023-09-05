import { ethers } from 'ethers'
import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'
import { getMessage } from '../helper/authHelper'
import { sign } from 'crypto'
import { getEncJWT, sendMessageToEnc, useEncRefreshToken } from '../helper/encryption'

describe("APIkey Test", () => {
  const signer = new ethers.Wallet(config.test_wallet1_private_key)
  test('Api Key Get and Verify: POST /get_api_key, GET /verify_api_key', async () => {
    const verificationMessage = JSON.parse(
      (
        await supertest(app).get(
          '/api/auth/get_message?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
        )
      ).text
    )
    expect(typeof verificationMessage).toBe('string')


    const signedMessage = await signer.signMessage(verificationMessage)
    const data = {
      publicKey: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1',
      signedMessage,
    }

    const apiKey = JSON.parse(
      (await supertest(app).post('/api/auth/get_api_key').send(data)).text
    )

    expect(typeof apiKey).toBe('string')

    // Verify API Key
    const verifyResponse = JSON.parse(
      (
        await supertest(app)
          .get('/api/auth/verify_api_key')
          .set('Authorization', `Bearer ${apiKey}`)
      ).text
    )
    expect(typeof verifyResponse.publicKey).toBe('string')

    // Get all keys
    const allKeys = JSON.parse(
      (
        await supertest(app)
          .get('/api/auth/get_user_keys')
          .set('Authorization', `Bearer ${apiKey}`)
      ).text
    )
    expect(typeof allKeys[0]['id']).toBe('string')

    // Revoke API Key Forbidden
    await supertest(app)
      .delete(`/api/auth/remove_api_key?keyId=${allKeys[0]['id']}`)
      .set('Authorization', `Bearer ${config.test_wallet7_api_key}`)
      .expect(403)

    // Revoke API Key
    const revokeResponse = JSON.parse(
      (
        await supertest(app)
          .delete(`/api/auth/remove_api_key?keyId=${allKeys[0]['id']}`)
          .set('Authorization', `Bearer ${apiKey}`)
      ).text
    )
    expect(typeof revokeResponse.data).toBe('string')
  }, 10000)

  test('Api Key test on old key: GET /verify_api_key', async () => {
    const data = JSON.parse(
      (
        await supertest(app)
          .get('/api/auth/verify_api_key')
          .set('Authorization', `Bearer ${config.test_wallet7_api_key}`)
      ).text
    )
    expect(typeof data.publicKey).toBe('string')
  }, 10000)

  test('Api Key Record Not Authorized: POST /get_api_key', async () => {
    const data = {
      publicKey: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1',
      signedMessage: 'signedMessage',
    }

    await supertest(app).post('/api/auth/get_api_key').send(data).expect(401)
  }, 10000)

  test('Verify API Key Record Not Found: GET /verify_api_key', async () => {
    await supertest(app)
      .get('/api/auth/verify_api_key')
      .set('Authorization', 'Bearer ' + '937b68b8-3768-45d1-950b-30c3836785d5')
      .expect(401)
  }, 10000)

  test('Verify API Key Bad Request: GET /verify_api_key', async () => {
    await supertest(app).get('/api/auth/verify_api_key').expect(401)
  }, 10000)
  test('Encryption ', async () => {
    let test_message = "message data"
    const data = await sendMessageToEnc(signer.address, test_message)
    const { encryptionRefreshToken, encryptionToken } = await getEncJWT(signer.address, await signer.signMessage(test_message))
    expect(typeof encryptionToken).toBe("string")
    expect(typeof encryptionRefreshToken).toBe("string")
    expect(encryptionToken?.length).toBeGreaterThan(100)


    const tokens = await useEncRefreshToken(signer.address, encryptionRefreshToken)
    expect(typeof tokens.encryptionToken).toBe("string")
    expect(typeof tokens.encryptionRefreshToken).toBe("string")
  }, 10000)


})