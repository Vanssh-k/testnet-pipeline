import app from '../../../app'
import supertest from 'supertest'

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
