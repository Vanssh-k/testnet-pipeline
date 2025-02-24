import app from '../../../app.js'
import supertest from 'supertest'

// status
test('Status: Get /deal_status', async () => {
  const dealStatus = JSON.parse(
    (
      await supertest(app).get(
        '/api/lighthouse/deal_status?cid=bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
      )
    ).text,
  )
  expect(typeof dealStatus[0].pieceCID).toBe('string')
}, 30000)
