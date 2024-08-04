import app from '../../../app.js'
import supertest from 'supertest'
import config from '../../../config/index.js'

// get_uploads
describe('user', () => {
  test('Get Uploads: GET /files_uploaded', async () => {
    await supertest(app)
      .get('/api/user/files_uploaded')
      .set(
        'Authorization',
        `Bearer ${config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key}`,
      )
      .expect(200)
      .then((response) => {
        const uploads = JSON.parse(response.text)
        expect(typeof uploads.fileList[0].fileName).toBe('string')
        expect(typeof uploads.fileList[0].cid).toBe('string')
      })
  }, 30000)

  // user_data_usage
  test('User Data Usage: GET /user_data_usage', async () => {
    await supertest(app)
      .get('/api/user/user_data_usage?publicKey=0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD')
      .set(
        'Authorization',
        `Bearer ${config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key}`,
      )
      .expect(200)
      .then((response) => {
        const usage = JSON.parse(response.text)
        expect(typeof usage.dataLimit).toBe('number')
        expect(typeof usage.dataUsed).toBe('number')
      })
  }, 30000)
})
