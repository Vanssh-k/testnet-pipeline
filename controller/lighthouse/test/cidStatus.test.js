const supertest = require('supertest');
const app = require('../../../app');

// status
test('Status: Get /cid_status', async () => {
  await supertest(app)
    .get(
      '/api/lighthouse/cid_status?cid=bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34',
    )
    .expect(200)
    .then((response) => {
      const status = JSON.parse(response.text);
      expect(typeof status[0].content.cid).toBe('string');
      expect(typeof status[0].content.name).toBe('string');
      expect(typeof status[0].content.size).toBe('number');
    });
}, 30000);

test('Status Catch: Get /cid_status', async () => {
  await supertest(app)
    .get(
      '/api/lighthouse/cid_status?cid=bafkreia4ruswe7ghckleh3lmpujo5asrdd7hrtu5r23zjk2robpcoendd',
    )
    .expect(400);
}, 30000);
