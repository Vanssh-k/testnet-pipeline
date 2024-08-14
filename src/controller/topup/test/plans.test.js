import supertest from 'supertest'
import ethers from 'ethers'
import app from '../../../app.js'

// get_active_plan_list
test('Get Transaction Details Main Case: GET /get_active_plan_list', async () => {
  await supertest(app)
    .get('/api/topup/get_active_plan_list')
    .expect(200)
    .then((response) => {
      const planDetails = JSON.parse(response.text)
      expect(typeof planDetails[0].amount).toBe('number')
    })
}, 30000)

// plan_details_by_id
test('Get Transaction Details Main Case: GET /plan_details_by_id', async () => {
  await supertest(app)
    .get('/api/topup/plan_details_by_id?subscriptionId=0')
    .expect(200)
    .then((response) => {
      const planDetails = JSON.parse(response.text)
      expect(typeof planDetails.data.amount).toBe('number')
    })
}, 30000)
