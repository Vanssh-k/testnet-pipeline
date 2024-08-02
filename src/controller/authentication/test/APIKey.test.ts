// import { ethers } from 'ethers'
// import app from '../../../app.js'
// import supertest from 'supertest'
// import config from '../../../config/index.js'

// describe('APIkey Test', () => {
//   const signer = new ethers.Wallet(config.test_wallet1_private_key)
//   const publicKey = signer.address//'0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'

//   test('Api Key Get and Verify: POST /get_api_key, GET /verify_api_key', async () => {
//     const verificationMessage = JSON.parse(
//       (await supertest(app).get(`/api/auth/get_message?publicKey=${publicKey}`)).text,
//     )
//     expect(typeof verificationMessage).toBe('string')

//     const signedMessage = await signer.signMessage(verificationMessage)
//     const data = { publicKey, signedMessage }

//     const apiKey = JSON.parse(
//       (await supertest(app).post(`/api/auth/create_api_key`).send(data)).text,
//     )
//     expect(typeof apiKey).toBe('string')

//     // Verify API Key
//     const verifyResponse = JSON.parse(
//       (await supertest(app).get(`/api/auth/verify_api_key`).set('Authorization', `Bearer ${apiKey}`)).text,
//     )
//     expect(typeof verifyResponse.publicKey).toBe('string')

//     // Get all keys
//     const allKeys = JSON.parse(
//       (await supertest(app).get(`/api/auth/get_user_keys`).set('Authorization', `Bearer ${apiKey}`)).text,
//     )
//     expect(typeof allKeys[0]['id']).toBe('string')

//     // Revoke API Key Forbidden
//     await supertest(app)
//       .delete(`/api/auth/remove_api_key?keyId=${allKeys[0]['id']}`)
//       .set('Authorization', `Bearer ${config.environment==='development'?config.test_wallet7_api_key_development:config.test_wallet7_api_key}`)
//       .expect(403)

//     // Revoke API Key
//     const revokeResponse = JSON.parse(
//       (await supertest(app).delete(`/api/auth/remove_api_key?keyId=${allKeys[0]['id']}`).set('Authorization', `Bearer ${apiKey}`)).text,
//     )
//     expect(typeof revokeResponse.data).toBe('string')
//   }, 10000)

//   test('Api Key test on old key: GET /verify_api_key', async () => {
//     const revokeResponse = JSON.parse(
//       (await supertest(app).get(`/api/auth/verify_api_key`).set('Authorization', `Bearer ${config.environment==='development'?config.test_wallet7_api_key_development:config.test_wallet7_api_key}`)).text,
//     )
//     expect(typeof revokeResponse.publicKey).toBe('string')
//   }, 10000)

//   test('Api Key Record Not Authorized: POST /create_api_key', async () => {
//     const data = { publicKey, signedMessage: 'signedMessage' }
//     await supertest(app).post(`/api/auth/create_api_key`).send(data).expect(401)
//   }, 10000)

//   test('Verify API Key Record Not Found: GET /verify_api_key', async () => {
//     await supertest(app)
//       .get(`/api/auth/verify_api_key`)
//       .set('Authorization', 'Bearer ' + '937b68b8-3768-45d1-950b-30c3836785d5')
//       .expect(401)
//   }, 10000)

//   test('Verify API Key Bad Request: GET /verify_api_key', async () => {
//     await supertest(app).get(`/api/auth/verify_api_key`).expect(401)
//   }, 10000)
// })
