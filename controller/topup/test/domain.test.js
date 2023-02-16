const supertest = require('supertest')
const ethers = require('ethers')
const app = require('../../../app')

// create_subdomain
test('Add SubDomain Main Case: POST /create_subdomain', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0xA3C960B3BA29367ecBCAf1430452C6cd7516F588'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = new ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                process.env.TEST_WALLET4_PRIVATE_KEY,
                provider
            )
            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0xA3C960B3BA29367ecBCAf1430452C6cd7516F588',
                signedMessage: signedMessage,
                subDomain: 'testingDomain',
            }

            await supertest(app)
                .post('/api/topup/create_subdomain')
                .send(data)
                .expect(200)
        })
}, 30000)

test('Add SubDomain Forbidden: POST /create_subdomain', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0xA3C960B3BA29367ecBCAf1430452C6cd7516F588'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = new ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                process.env.TEST_WALLET4_PRIVATE_KEY,
                provider
            )
            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0xA3C960B3BA29367ecBCAf1430452C6cd7516F588',
                signedMessage: signedMessage,
                subDomain: 'api',
            }

            await supertest(app)
                .post('/api/topup/create_subdomain')
                .send(data)
                .expect(403)
        })
}, 30000)

// check_subdomain
test('Check Sub Domain Main Case: GET /check_subdomain', async () => {
    await supertest(app)
        .get('/api/topup/check_subdomain?subDomain=testingDomain')
        .expect(200)
        .then((response) => {
            const exists = JSON.parse(response.text)
            expect(exists).toBe('exist')
        })
}, 30000)

test('Check Sub Domain Not Exist: GET /check_subdomain', async () => {
    await supertest(app)
        .get('/api/topup/check_subdomain?subDomain=gatey')
        .expect(200)
        .then((response) => {
          const exists = JSON.parse(response.text)
          expect(exists).toBe('not-exist')
        })
}, 30000)

// get_subdomain
test('Get Sub Domain Main Case: GET /get_subdomain', async () => {
    await supertest(app)
        .get(
            '/api/topup/get_subdomain?publicKey=0xA3C960B3BA29367ecBCAf1430452C6cd7516F588'
        )
        .expect(200)
        .then((response) => {
            const subDomain = JSON.parse(response.text)
            expect(typeof subDomain[0]["subDomainName"]).toBe('string')
        })
}, 30000)

test('Get Sub Domain Not Found: GET /get_subdomain', async () => {
    await supertest(app)
        .get(
            '/api/topup/get_subdomain?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5161'
        )
        .expect(200)
        .then((response) => {
          const subDomain = JSON.parse(response.text)
          expect(subDomain.length).toBe(0)
      })
}, 30000)
