const supertest = require('supertest')
const ethers = require('ethers')
const app = require('../../../app')

// get_active_plan_list
test('Get Transaction Details Main Case: GET /get_active_plan_list', async () => {
  await supertest(app)
      .get(
          '/api/topup/get_active_plan_list'
      )
      .expect(200)
      .then((response) => {
          const planDetails = JSON.parse(response.text)
          expect(typeof planDetails[0].nextDeductionInNumOfBlocks).toBe('number')
      })
}, 30000)

// users_active_plan
test('Get Transaction Details Main Case: GET /users_active_plan', async () => {
  await supertest(app)
      .get(
          '/api/topup/users_active_plan?publicKey=0xa3c960b3ba29367ecbcaf1430452c6cd7516f588'
      )
      .expect(200)
      .then((response) => {
          const planDetails = JSON.parse(response.text)
          expect(typeof planDetails.data.subscriptionId).toBe('string')
      })
}, 30000)

// plan_details_by_id
test('Get Transaction Details Main Case: GET /plan_details_by_id', async () => {
  await supertest(app)
      .get(
          '/api/topup/plan_details_by_id?subscriptionId=0'
      )
      .expect(200)
      .then((response) => {
          const planDetails = JSON.parse(response.text)
          expect(typeof planDetails.data.nextDeductionInNumOfBlocks).toBe('number')
      })
}, 30000)
