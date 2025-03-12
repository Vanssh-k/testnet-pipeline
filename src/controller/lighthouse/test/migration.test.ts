import supertest from 'supertest'
import app from '../../../app.js'
import config from '../../../config/index.js'

test('List Migration Request: GET /list_migration_requests', async () => {
  const publicKey =
    config.environment === 'development'
      ? '0x75a22ede971080c8448c46de6ae5df3f64c67475'
      : '0xc88c729ef2c18baf1074ea0df537d61a54a8ce7b'
  await supertest(app)
    .get(`/api/lighthouse/list_migration_requests?publicKey=${publicKey}`)
    .expect(200)
    .then((response) => {
      const requestList = JSON.parse(response.text)
      expect(typeof requestList[0].migrationStatus).toBe('string')
    })
}, 30000)

test('Migration Request Info: GET /migration_request_info', async () => {
  const reqID =
    config.environment === 'development'
      ? 'c5e01413-e630-45b9-9556-976ac0bd75c8'
      : '706da465-c11d-49c1-af80-5f2e74bc6821'
  await supertest(app)
    .get(`/api/lighthouse/migration_request_info?requestId=${reqID}`)
    .expect(200)
    .then((response) => {
      const requestInfo = JSON.parse(response.text)
      expect(typeof requestInfo[0].cid).toBe('string')
    })
}, 30000)

test('Migration Request: POST /migration_request', async () => {
  const data = {
    data: JSON.stringify([{ cid: 'QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc' }]),
  }
  await supertest(app)
    .post('/api/lighthouse/migration_request')
    .send(data)
    .set(
      'Authorization',
      `Bearer ${config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key}`,
    )
    .expect(200)
    .then((response) => {
      const res = JSON.parse(response.text)
      expect(typeof res).toBe('object')
    })
}, 10000)

test('Migration Request No CID: POST /migration_request', async () => {
  const data = {
    data: JSON.stringify('[]'),
  }

  await supertest(app)
    .post('/api/lighthouse/migration_request')
    .send(data)
    .set(
      'Authorization',
      `Bearer ${config.environment === 'development' ? config.test_wallet7_api_key_development : config.test_wallet7_api_key}`,
    )
    .expect(400)
}, 10000)

test('Migration Request Wrong CID: POST /migration_request', async () => {
  const data = {
    data: JSON.stringify('["QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2c"]'),
  }

  await supertest(app).post('/api/lighthouse/migration_request').send(data).expect(401)
}, 10000)
