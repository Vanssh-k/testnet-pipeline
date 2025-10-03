import app from '../../../app.js'
import supertest from 'supertest'
import config from '../../../config/index.js'

describe('Bandwidth Test', () => {
  const testClientId = 'test-client-123'
  const testApiKey =
    config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key

  test('Get Bandwidth Records: GET /records', async () => {
    const response = await supertest(app)
      .get(`/api/bandwidth/records?client_id=${testClientId}&start_date=2024-01-01&end_date=2024-12-31`)
      .set('Authorization', `Bearer ${testApiKey}`)
      .expect(200)

    const data = JSON.parse(response.text)
    expect(Array.isArray(data.data)).toBe(true)
    expect(typeof data.totalUsage).toBe('number')
    expect(typeof data.totalRequests).toBe('number')
    expect(data.geoBreakdown).toHaveProperty('us')
    expect(data.geoBreakdown).toHaveProperty('ind')
  }, 10000)

  test('Missing client_id: GET /records', async () => {
    await supertest(app)
      .get('/api/bandwidth/records?start_date=2024-01-01&end_date=2024-12-31')
      .set('Authorization', `Bearer ${testApiKey}`)
      .expect(400)
  }, 10000)

  test('Missing start_date: GET /records', async () => {
    await supertest(app)
      .get(`/api/bandwidth/records?client_id=${testClientId}&end_date=2024-12-31`)
      .set('Authorization', `Bearer ${testApiKey}`)
      .expect(400)
  }, 10000)

  test('Missing end_date: GET /records', async () => {
    await supertest(app)
      .get(`/api/bandwidth/records?client_id=${testClientId}&start_date=2024-01-01`)
      .set('Authorization', `Bearer ${testApiKey}`)
      .expect(400)
  }, 10000)

  test('Invalid date format: GET /records', async () => {
    await supertest(app)
      .get(`/api/bandwidth/records?client_id=${testClientId}&start_date=invalid&end_date=2024-12-31`)
      .set('Authorization', `Bearer ${testApiKey}`)
      .expect(400)
  }, 10000)

  test('Start date after end date: GET /records', async () => {
    await supertest(app)
      .get(`/api/bandwidth/records?client_id=${testClientId}&start_date=2024-12-31&end_date=2024-01-01`)
      .set('Authorization', `Bearer ${testApiKey}`)
      .expect(400)
  }, 10000)

  test('No auth token: GET /records', async () => {
    await supertest(app)
      .get(`/api/bandwidth/records?client_id=${testClientId}&start_date=2024-01-01&end_date=2024-12-31`)
      .expect(401)
  }, 10000)
})
