const supertest = require('supertest');
const app = require('../../../app');

// status
test('Status: Get /deal_status', async () => {
  await supertest(app)
    .get(
      '/api/lighthouse/deal_status?cid=bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
    )
    .expect(200)
    .then((response) => {
      const dealStatus = JSON.parse(response.text);
      expect(typeof dealStatus[0].dealId).toBe('number');
    });
}, 30000);

test('Status Catch: Get /deal_status', async () => {
  await supertest(app)
    .get(
      '/api/lighthouse/deal_status?cid=bafkreia4ruswe7ghckleh3lmpujo5asrdd7hrtu5r23zjk2robpcoendd',
    )
    .expect(400);
}, 30000);
