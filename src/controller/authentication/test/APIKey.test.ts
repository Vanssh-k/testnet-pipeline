import { ethers } from 'ethers'
import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

describe('APIkey Test', () => {
  const signer = new ethers.Wallet(config.test_wallet1_private_key)
  const publicKey = '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
  const testUrl = '/api/auth'

  const getResponseText = async (request) => JSON.parse((await request).text)
  const verifyType = (data, type) => expect(typeof data).toBe(type)

  test('Api Key Get and Verify: POST /get_api_key, GET /verify_api_key', async () => {
    const verificationMessage = await getResponseText(
      supertest(app).get(`${testUrl}/get_message?publicKey=${publicKey}`)
    )
    verifyType(verificationMessage, 'string')

    const signedMessage = await signer.signMessage(verificationMessage)
    const data = { publicKey, signedMessage }

    const apiKey = await getResponseText(
      supertest(app).post(`${testUrl}/get_api_key`).send(data)
    )
    verifyType(apiKey, 'string')

    // Verify API Key
    const verifyResponse = await getResponseText(
      supertest(app)
        .get(`${testUrl}/verify_api_key`)
        .set('Authorization', `Bearer ${apiKey}`)
    )
    verifyType(verifyResponse.publicKey, 'string')

    // Get all keys
    const allKeys = await getResponseText(
      supertest(app)
        .get(`${testUrl}/get_user_keys`)
        .set('Authorization', `Bearer ${apiKey}`)
    )
    verifyType(allKeys[0]['id'], 'string')

    // Revoke API Key Forbidden
    await supertest(app)
      .delete(`${testUrl}/remove_api_key?keyId=${allKeys[0]['id']}`)
      .set('Authorization', `Bearer ${config.test_wallet7_api_key}`)
      .expect(403)

    // Revoke API Key
    const revokeResponse = await getResponseText(
      supertest(app)
        .delete(`${testUrl}/remove_api_key?keyId=${allKeys[0]['id']}`)
        .set('Authorization', `Bearer ${apiKey}`)
    )
    verifyType(revokeResponse.data, 'string')
  }, 10000)

  test('Api Key test on old key: GET /verify_api_key', async () => {
    const data = await getResponseText(
      supertest(app)
        .get(`${testUrl}/verify_api_key`)
        .set('Authorization', `Bearer ${config.test_wallet7_api_key}`)
    )
    verifyType(data.publicKey, 'string')
  }, 10000)

  test('Api Key Record Not Authorized: POST /get_api_key', async () => {
    const data = { publicKey, signedMessage: 'signedMessage' }
    await supertest(app).post(`${testUrl}/get_api_key`).send(data).expect(401)
  }, 10000)

  test('Verify API Key Record Not Found: GET /verify_api_key', async () => {
    await supertest(app)
      .get(`${testUrl}/verify_api_key`)
      .set('Authorization', 'Bearer ' + '937b68b8-3768-45d1-950b-30c3836785d5')
      .expect(401)
  }, 10000)

  test('Verify API Key Bad Request: GET /verify_api_key', async () => {
    await supertest(app).get(`${testUrl}/verify_api_key`).expect(401)
  }, 10000)
})
