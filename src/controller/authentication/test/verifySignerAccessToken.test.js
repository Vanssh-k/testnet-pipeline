import ethers from 'ethers'
import supertest from 'supertest'
import app from '../../../app'
import config from '../../../config'

test('Verify Signer and Access Token: POST /verify_signer', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5160'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = new ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                config.test_wallet2_private_key,
                provider
            )
            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160',
                signedMessage,
            }

            await supertest(app)
                .post('/api/auth/verify_signer')
                .send(data)
                .expect(200)
                .then(async (response) => {
                    const token = JSON.parse(response.text)
                    expect(typeof token.accessToken).toBe('string')
                    expect(typeof token.refreshToken).toBe('string')

                    await supertest(app)
                        .get('/api/auth/verify_access_token')
                        .set('Authorization', `Bearer ${token.accessToken}`)
                        .expect(200)
                        .then((response) => {
                            const data = JSON.parse(response.text)
                            expect(typeof data.publicKey).toBe('string')
                        })

                    await supertest(app)
                        .get('/api/auth/refresh_access_token')
                        .set('Authorization', `Bearer ${token.refreshToken}`)
                        .expect(200)
                        .then((response) => {
                            const data = JSON.parse(response.text)
                            expect(typeof data.accessToken).toBe('string')
                        })

                    await supertest(app)
                        .delete('/api/auth/remove_refresh_token')
                        .set('Authorization', `Bearer ${token.refreshToken}`)
                        .expect(200)
                })
        })
}, 10000)

test('Verify Signer Unauthorized Case: POST /verify_signer', async () => {
    const data = {
        publicKey: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160',
        signedMessage: 'signedMessage',
    }

    await supertest(app).post('/api/auth/verify_signer').send(data).expect(401)
}, 10000)

test('Verify Access Token Unauthorized Case: POST /verify_access_token', async () => {
    await supertest(app)
        .get('/api/auth/verify_access_token')
        .set('Authorization', 'Bearer ' + 'blablabla')
        .expect(401)
}, 10000)
