const supertest = require('supertest');
const ethers = require('ethers');
const app = require('../../app');

// add_subdomain
test('Add SubDomain Main Case: POST /add_subdomain', async () => {
  await supertest(app)
    .get(
      '/api/auth/get_message?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67475',
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET6_PRIVATE_KEY,
        provider,
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
        signedMessage,
        subDomain: 'rav',
      };

      await supertest(app)
        .post('/api/gateway/add_subdomain')
        .send(data)
        .expect(200)
        .then((response) => {
          const message = JSON.parse(response.text);
          expect(message).toBe('SubDomain Created');
        });
    });
}, 30000);

test('Add SubDomain Forbidden: POST /add_subdomain', async () => {
  await supertest(app)
    .get(
      '/api/auth/get_message?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67475',
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET6_PRIVATE_KEY,
        provider,
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
        signedMessage,
        subDomain: 'api',
      };

      await supertest(app)
        .post('/api/gateway/add_subdomain')
        .send(data)
        .expect(403);
    });
}, 30000);

test('Add SubDomain Authentication Error: POST /add_subdomain', async () => {
  const data = {
    publicKey: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1',
    signedMessage: 'signedMessage',
    subDomain: 'kkkk',
  };

  await supertest(app)
    .post('/api/gateway/add_subdomain')
    .send(data)
    .expect(401);
}, 30000);

// check_subdomain
test('Check Sub Domain Main Case: GET /check_subdomain', async () => {
  await supertest(app)
    .get('/api/gateway/check_subdomain?subDomain=rav')
    .expect(200)
    .then((response) => {
      const exists = JSON.parse(response.text);
      expect(exists).toBe('Exists');
    });
}, 30000);

test('Check Sub Domain Not Found: GET /check_subdomain', async () => {
  await supertest(app)
    .get('/api/gateway/check_subdomain?subDomain=gateway')
    .expect(404);
}, 30000);

// get_subdomain
test('Get Sub Domain Main Case: GET /get_subdomain', async () => {
  await supertest(app)
    .get('/api/gateway/get_subdomain?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67475')
    .expect(200)
    .then((response) => {
      const subDomain = JSON.parse(response.text);
      expect(subDomain).toBe('rav');
    });
}, 30000);

test('Get Sub Domain Not Found: GET /get_subdomain', async () => {
  await supertest(app)
    .get('/api/gateway/get_subdomain?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5161')
    .expect(404);
}, 30000);

// get_transaction_details
test('Get Transaction Details Main Case: GET /get_transaction_details', async () => {
  await supertest(app)
    .get('/api/gateway/get_transaction_details?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67475')
    .expect(200)
    .then((response) => {
      const txDetails = JSON.parse(response.text);
      expect(typeof txDetails[0].network).toBe('string');
    });
}, 30000);

test('Get Transaction Details Record Not Found: GET /get_transaction_details', async () => {
  await supertest(app)
    .get('/api/gateway/get_transaction_details?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67435')
    .expect(200)
    .then((response) => {
      const txDetails = JSON.parse(response.text);
      expect(txDetails.length).toBe(0);
    });
}, 30000);
