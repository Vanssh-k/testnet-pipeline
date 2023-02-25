const supertest  from 'supertest')
const ethers  from 'ethers')
const app  from '../../../app')

test('Api Key Get and Verify: POST /get_api_key, GET /verify_api_key', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = new ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                process.env.TEST_WALLET1_PRIVATE_KEY,
                provider
            )

            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1',
                signedMessage,
            }

            await supertest(app)
                .post('/api/auth/get_api_key')
                .send(data)
                .expect(200)
                .then(async (response) => {
                    const apiKey = JSON.parse(response.text)
                    expect(typeof apiKey).toBe('string')

                    // Verify API Key
                    await supertest(app)
                        .get('/api/auth/verify_api_key')
                        .set('Authorization', `Bearer ${apiKey}`)
                        .expect(200)
                        .then((response) => {
                            const data = JSON.parse(response.text)
                            expect(typeof data.publicKey).toBe('string')
                        })
                })
        })
}, 10000)

test('Api Key test on old key: GET /verify_api_key', async () => {
    await supertest(app)
        .get('/api/auth/verify_api_key')
        .set('Authorization', `Bearer c9b321bd-7220-47a6-a866-0ca0f4584e28`)
        .expect(200)
        .then((response) => {
            const data = JSON.parse(response.text)
            expect(typeof data.publicKey).toBe('string')
        })
}, 10000)

test('Api Key Record Not Found: POST /get_api_key', async () => {
    const data = {
        publicKey: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb1A0',
        signedMessage: 'signedMessage',
    }

    await supertest(app).post('/api/auth/get_api_key').send(data).expect(404)
}, 10000)

test('Api Key Record Not Authorized: POST /get_api_key', async () => {
    const data = {
        publicKey: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1',
        signedMessage: 'signedMessage',
    }

    await supertest(app).post('/api/auth/get_api_key').send(data).expect(401)
}, 10000)

test('Verify API Key Record Not Found: GET /verify_api_key', async () => {
    await supertest(app)
        .get('/api/auth/verify_api_key')
        .set(
            'Authorization',
            'Bearer ' + '937b68b8-3768-45d1-950b-30c3836785d5'
        )
        .expect(401)
}, 10000)

test('Verify API Key Bad Request: GET /verify_api_key', async () => {
    await supertest(app).get('/api/auth/verify_api_key').expect(401)
}, 10000)
