import supertest from 'supertest'
import app from '../../../app'
import config from '../../../config'

// add_cid_to_queue
test('Add CID To Queue: GET /add_cid_to_queue', async () => {
  const data = {
    name: 'adiyogi.jpg',
    cid: 'bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
    publicKey: '0x487fc2fe07c593eab555729c3dd6df85020b5160',
    encryption: false,
    mimeType: 'image/jpeg',
    size: '239214',
  }

  await supertest(app)
    .post('/api/lighthouse/add_cid_to_queue')
    .set('Authorization', `Bearer ${config.route_access_token ?? ''}`)
    .send(data)
    .expect(200)
}, 30000)

test('Add CID To Queue Record Not Found: GET /add_cid_to_queue', async () => {
  const data = {
    name: 'adiyogi.jpg',
    cid: 'bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
    publicKey: '0x487fc2fe07c593eab555729c3dd6df85020b5161',
    encryption: false,
    mimeType: 'image/jpeg',
    size: '239214',
  }

  await supertest(app)
    .post('/api/lighthouse/add_cid_to_queue')
    .set('Authorization', `Bearer ${config.route_access_token ?? ''}`)
    .send(data)
    .expect(404)
}, 30000)
