import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

test('CID TAG Test', async () => {
  const apiKey = config.test_wallet7_api_key

  // Create Tag
  const tag = '0xb2126d4b177d4b063344e07080f967dbac8076884375fd8adcb557c5f29746b2'
  const data = {
    "tag": tag,
    "cid": "QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc"
  }

  const createTagRes = JSON.parse(
    (
      await supertest(app)
      .post('/api/user/create_tag')
      .send(data).set('Authorization', `Bearer ${apiKey}`)
    ).text
  )

  expect(typeof createTagRes).toBe('string')

  // Get Tag Details
  const getTagDetails = JSON.parse(
    (
      await supertest(app)
        .get(`/api/user/get_tag_details?tag=${tag}`)
        .set('Authorization', `Bearer ${apiKey}`)
    ).text
  )
  expect(typeof getTagDetails.data.tag).toBe('string')

  // Get All CID
  const allTags = JSON.parse(
    (
      await supertest(app)
        .get('/api/user/get_all_tags')
        .set('Authorization', `Bearer ${apiKey}`)
    ).text
  )
  expect(typeof allTags.data[0]['tag']).toBe('string')

  // Remove Key
  const removeTagRes = JSON.parse(
    (
      await supertest(app)
        .delete(`/api/user/remove_tag?tag=${tag}`)
        .set('Authorization', `Bearer ${apiKey}`)
    ).text
  )
  expect(typeof removeTagRes).toBe('string')
}, 60000)
