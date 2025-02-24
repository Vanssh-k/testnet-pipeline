import app from '../../../app.js'
import supertest from 'supertest'
import config from '../../../config/index.js'
import { Result } from 'ethers'

describe('user', () => {
  // get_referral_code
  test('Get Referral Code: GET /get_referral_code', async () => {
    await supertest(app)
      .get('/api/user/get_referral_code')
      .set(
        'Authorization',
        `Bearer ${config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key}`,
      )
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text)
        expect(typeof result.referralCode).toBe('string')
        expect(result.referralCode).toHaveLength(32)
      })
  }, 30000)

  // create_referral
  test('Create Referral: POST /create_referral', async () => {
    // First get a valid referral code
    const referralResponse = await supertest(app)
      .get('/api/user/get_referral_code')
      .set(
        'Authorization',
        `Bearer ${config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key}`,
      )

    const { referralCode } = JSON.parse(referralResponse.text)
    console.log(referralCode)

    await supertest(app)
      .get(`/api/user/create_referral?referredBy=${referralCode}`)
      .set('Authorization', `Bearer ${config.test_wallet6_api_key}`)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe('"Success"')
      })
  }, 30000)

  // get_referred_by
  test('Get Referred By: GET /get_referred_by', async () => {
    await supertest(app)
      .get('/api/user/get_referred_by')
      .set('Authorization', `Bearer ${config.test_wallet6_api_key}`)
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text)
        expect(result).toHaveProperty('referredBy')
        expect(typeof result.referredBy).toBe('string')
      })
  }, 30000)

  // get_my_referrals
  test('Get My Referrals: GET /get_my_referrals', async () => {
    await supertest(app)
      .get('/api/user/get_my_referrals')
      .set(
        'Authorization',
        `Bearer ${config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key}`,
      )
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text)
        expect(result).toHaveProperty('referralCode')
        expect(Array.isArray(result.referralCode)).toBe(true)
      })
  }, 30000)
})
