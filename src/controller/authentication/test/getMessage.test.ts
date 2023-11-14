import app from '../../../app'
import supertest from 'supertest'
import { sendMessageToEnc } from '../helper/encryption'

test('EVM Message: wrong publicKey: GET /get_message', async () => {
  await supertest(app)
    .get(
      '/api/auth/get_message?publicKey=0xA3C960B3BA29367ecBCAf1430452C6cd7516F58'
    )
    .expect(400)
}, 10000)

test('EVM Message: GET /get_message', async () => {
  const message = JSON.parse(
    (
      await supertest(app).get(
        '/api/auth/get_message?publicKey=0xA3C960B3BA29367ecBCAf1430452C6cd7516F588'
      )
    ).text
  )
  expect(typeof message).toBe('string')
}, 10000)

test('Solana Message: GET /get_message', async () => {
  const message = JSON.parse(
    (
      await supertest(app).get(
        '/api/auth/get_message?publicKey=J7wvyu9x2vzAssgkNKi4hHdfuJaJAHZV9RxXPrsbkLEK'
      )
    ).text
  )
  expect(typeof message).toBe('string')
}, 10000)

test('Message to enc node as well', async () => {
  const data = await sendMessageToEnc(
    '0xA3C960B3BA29367ecBCAf1430452C6cd7516F588',
    'message data'
  )
  expect(typeof data?.[0]['message']).toBe('string')
}, 10000)
