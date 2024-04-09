import app from '../../../app'
import supertest from 'supertest'

const testGetMessageWithEnc = async (publicKey: string, expectedStatusCode: number, expectedType: string) => {
  const response = await supertest(app).get(`/api/auth/get_message?publicKey=${publicKey}&encryption=true`)
  const message = JSON.parse(response.text)
  expect(response.status).toBe(expectedStatusCode)
  expect(typeof message).toBe(expectedType)
}

const testGetMessage = async (publicKey: string, expectedStatusCode: number, expectedType: string) => {
  const response = await supertest(app).get(`/api/auth/get_message?publicKey=${publicKey}`)
  const message = JSON.parse(response.text)

  expect(response.status).toBe(expectedStatusCode)
  if (expectedStatusCode !== 400) {
    expect(typeof message).toBe(expectedType)
  }
}

test('EVM Message: wrong publicKey: GET /get_message', async () => {
  await testGetMessage('0xA3C960B3BA29367ecBCAf1430452C6cd7516F58', 400, 'string')
}, 10000)

test('EVM Message: GET /get_message', async () => {
  await testGetMessage('0xA3C960B3BA29367ecBCAf1430452C6cd7516F588', 200, 'string')
}, 10000)

test('Solana Message: GET /get_message', async () => {
  await testGetMessage('J7wvyu9x2vzAssgkNKi4hHdfuJaJAHZV9RxXPrsbkLEK', 200, 'string')
}, 10000)

test('Message to enc node as well', async () => {
  await testGetMessageWithEnc('0xA3C960B3BA29367ecBCAf1430452C6cd7516F588', 200, 'string')
}, 10000)
