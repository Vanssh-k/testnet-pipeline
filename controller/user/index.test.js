const ethers = require('ethers');
const supertest = require('supertest');
const app = require('../../app');

// get_uploads
test('Get Uploads: GET /get_uploads', async () => {
  await supertest(app)
    .get(
      '/api/user/get_uploads?publicKey=0xC88C729Ef2c18baf1074EA0Df537d61a54A8CE7b',
    )
    .expect(200)
    .then((response) => {
      const uploads = JSON.parse(response.text);
      expect(typeof uploads[0].fileName).toBe('string');
      expect(typeof uploads[0].cid).toBe('string');
    });
}, 30000);

// user_data_usage
test('User Data Usage: GET /user_data_usage', async () => {
  await supertest(app)
    .get(
      '/api/user/user_data_usage?publicKey=0xC88C729Ef2c18baf1074EA0Df537d61a54A8CE7b',
    )
    .expect(200)
    .then((response) => {
      const usage = JSON.parse(response.text);
      expect(typeof usage.dataLimit).toBe('number');
      expect(typeof usage.dataUsed).toBe('number');
    });
}, 30000);

test('User Data Usage Record Not Found Error: GET /user_data_usage', async () => {
  await supertest(app)
    .get(
      '/api/user/user_data_usage?publicKey=0xC88C729Ef2c18baf1074EA0Df537d61a54A8CE7c',
    )
    .expect(404);
}, 30000);

// faucet_status
test('Faucet Status: GET /faucet_status', async () => {
  await supertest(app)
    .get(
      '/api/auth/get_message?publicKey=0x210C6012ba53ebbAf64353245cD46E99D0E84652',
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET3_PRIVATE_KEY,
        provider,
      );

      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: '0x210C6012ba53ebbAf64353245cD46E99D0E84652',
        signedMessage,
      };

      await supertest(app)
        .post('/api/auth/verify_signer')
        .send(data)
        .expect(200)
        .then(async (response) => {
          const token = JSON.parse(response.text);

          await supertest(app)
            .get('/api/user/faucet_status')
            .set('Authorization', `Bearer ${token.accessToken}`)
            .expect(200);
        });
    });
}, 10000);

test('Update Data Usage Migration: GET /update_data_usage', async () => {
  await supertest(app)
    .get('/api/user/update_data_usage?requestId=706da465-c11d-49c1-af80-5f2e74bc6821')
    .set('Authorization', `Bearer ${process.env.ROUTE_ACCESS_TOKEN}`)
    .expect(200);
}, 10000);
