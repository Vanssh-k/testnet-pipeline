import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

// get_uploads
describe('user', () => {
  test('Get Uploads: GET /files_uploaded', async () => {
    await supertest(app)
      .get('/api/user/files_uploaded?pageNo=1')
      .set('Authorization', `Bearer ${config.test_wallet7_api_key}`)
      .expect(200)
      .then((response) => {
        const uploads = JSON.parse(response.text)
        expect(typeof uploads.fileList[0].fileName).toBe('string')
        expect(typeof uploads.fileList[0].cid).toBe('string')
      })
  }, 30000)

  test('Get Uploads Page no 0: GET /files_uploaded', async () => {
    await supertest(app)
      .get('/api/user/files_uploaded?pageNo=0')
      .set('Authorization', `Bearer ${config.test_wallet7_api_key}`)
      .expect(502)
  }, 30000)

  test('Get Uploads Page no>count: GET /files_uploaded', async () => {
    await supertest(app)
      .get('/api/user/files_uploaded?pageNo=10')
      .set('Authorization', `Bearer ${config.test_wallet7_api_key}`)
      .expect(200)
      .then((response) => {
        const uploads = JSON.parse(response.text)
        expect(uploads.fileList.length).toBe(0)
      })
  }, 30000)

  // user_data_usage
  test('User Data Usage: GET /user_data_usage', async () => {
    await supertest(app)
      .get('/api/user/user_data_usage?publicKey=0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD')
      .expect(200)
      .then((response) => {
        const usage = JSON.parse(response.text)
        expect(typeof usage.dataLimit).toBe('number')
        expect(typeof usage.dataUsed).toBe('number')
      })
  }, 30000)

  // faucet_status
  test('Faucet Status: GET /faucet_status', async () => {
    const apiKey = config.test_wallet7_api_key
    await supertest(app).get('/api/user/faucet_status').set('Authorization', `Bearer ${apiKey}`).expect(200)
  }, 10000)
})
