import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

// Record Transaction
test('Get Transaction Details Main Case: GET /record_transaction', async () => {
  const data = {
    txHash: '0x485e21cbc8a5c76c83e6e062d2e175face12bafc6c6ae49a4f4fd8837db91a7d',
    depositor: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588',
    tokenAddress: '0x21C561e551638401b937b03fE5a0a0652B99B7DD',
    subscriptionID: '0',
    chain: 'mumbai',
  }
  await supertest(app)
    .post('/api/topup/record_transaction')
    .send(data)
    .set('Authorization', `Bearer ${config.transaction_route_token}`)
    .expect(200)
    .then((response) => {
      const txDetails = JSON.parse(response.text)
      expect(txDetails.data).toBe('Success!!!')
    })
}, 30000)

// get_user_transactions
test('Get Transaction Details Main Case: GET /get_user_transactions', async () => {
  await supertest(app)
    .get('/api/topup/get_user_transactions?publicKey=0x4e6d5be93ab7c1f75e30dd5a7f574f42f675eed3')
    .expect(200)
    .then((response) => {
      const txDetails = JSON.parse(response.text)
      expect(typeof txDetails[0].network).toBe('string')
    })
}, 30000)

test('Get Transaction Details Record Not Found: GET /get_user_transactions', async () => {
  await supertest(app)
    .get('/api/topup/get_user_transactions?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67435')
    .expect(200)
    .then((response) => {
      const txDetails = JSON.parse(response.text)
      expect(txDetails.length).toBe(0)
    })
}, 30000)
