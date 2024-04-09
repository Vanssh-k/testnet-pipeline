import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

test('IPNS Test', async () => {
  const apiKey = config.test_wallet7_api_key

  // Generate key
  const ipns = JSON.parse(
    (await supertest(app).get('/api/ipns/generate_key').set('Authorization', `Bearer ${apiKey}`)).text,
  )
  const key = ipns.ipnsName
  expect(typeof key).toBe('string')

  // Publish CID
  const cid = 'QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc'
  const publishCID = JSON.parse(
    (
      await supertest(app)
        .get(`/api/ipns/publish_record?cid=${cid}&keyName=${key}`)
        .set('Authorization', `Bearer ${apiKey}`)
    ).text,
  )
  expect(typeof publishCID.Value).toBe('string')

  // Get All CID
  const allRecords = JSON.parse(
    (await supertest(app).get('/api/ipns/get_ipns_records').set('Authorization', `Bearer ${apiKey}`)).text,
  )
  expect(typeof allRecords[0]['ipnsName']).toBe('string')

  // Remove Key
  const removeKey = JSON.parse(
    (await supertest(app).delete(`/api/ipns/remove_key?keyName=${key}`).set('Authorization', `Bearer ${apiKey}`)).text,
  )
  expect(typeof removeKey.Keys[0]['Id']).toBe('string')
}, 60000)

test('IPNS Test publishRecord forbidden', async () => {
  // Publish CID
  const apiKey = config.test_wallet7_api_key
  const key = '4aaa95dfd6c4400bb468e94f361598d5'
  const cid = 'QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc'
  await supertest(app)
    .get(`/api/ipns/publish_record?cid=${cid}&keyName=${key}`)
    .set('Authorization', `Bearer ${apiKey}`)
    .expect(403)
}, 1000)

test('IPNS Test removeKey forbidden', async () => {
  // Publish CID
  const apiKey = config.test_wallet7_api_key
  const key = '4aaa95dfd6c4400bb468e94f361598d5'
  await supertest(app)
    .delete(`/api/ipns/remove_key?keyName=${key}`)
    .set('Authorization', `Bearer ${apiKey}`)
    .expect(403)
}, 1000)
