import supertest from 'supertest'
import app from '../../../app'

// add_cid
test('Add CID Main Case: GET /add_cid', async () => {
    const data = {
        name: 'adiyogi.jpg',
        cid: 'bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
    }

    await supertest(app).post('/api/lighthouse/add_cid').send(data).expect(200)
}, 30000)

test('Add CID Error Case: GET /add_cid', async () => {
    const data = {
        name: 'adiyogi.jpg',
        cid: 'bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend',
    }

    await supertest(app).post('/api/lighthouse/add_cid').send(data).expect(400)
}, 30000)

// add_cid_to_queue
test('Add CID To Queue: GET /add_cid_to_queue', async () => {
    const data = {
        name: 'adiyogi.jpg',
        cid: 'bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
        publicKey: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160',
        encryption: false,
        mimeType: 'image/jpeg',
        size: '239214',
    }

    await supertest(app)
        .post('/api/lighthouse/add_cid_to_queue')
        .set('Authorization', `Bearer ${process.env.ROUTE_ACCESS_TOKEN}`)
        .send(data)
        .expect(200)
}, 30000)

test('Add CID To Queue Record Not Found: GET /add_cid_to_queue', async () => {
    const data = {
        name: 'adiyogi.jpg',
        cid: 'bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
        publicKey: '0x487fc2fE07c593EAb555729c3DD6dF85020B5179',
        encryption: false,
        mimeType: 'image/jpeg',
        size: '239214',
    }

    await supertest(app)
        .post('/api/lighthouse/add_cid_to_queue')
        .send(data)
        .expect(404)
}, 30000)
