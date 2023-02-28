import supertest  from 'supertest'
import ethers  from 'ethers'
import app  from '../../../app'
import dotenv from 'dotenv'
dotenv.config()

test('Twitter, User Not Found: GET /tweet_recharge', async () => {
    await supertest(app)
        .get(
            '/api/auth/tweet_recharge?publicKey=0x111B7C7114F7372207Ab0b36F1353B5d2D3b2a&twitterID=1536248943725535233'
        )
        .set('Authorization', 'Bearer ' + 'superman')
        .expect(401)
}, 10000)

test('Twitter, Auth Failed: GET /tweet_recharge', async () => {
    await supertest(app)
        .get(
            '/api/auth/tweet_recharge?publicKey=0x43cb632F3dfC07F790ea93F9F9CF42f9A41400C2&twitterID=1536248943725535233'
        )
        .set('Authorization', 'Bearer ' + 'superman')
        .expect(401)
}, 10000)

test('Twitter, Invalid Tweet & Success: GET /tweet_recharge', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = new ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                process.env.TEST_WALLET5_PRIVATE_KEY,
                provider
            )
            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2',
                signedMessage,
            }

            await supertest(app)
                .post('/api/auth/verify_signer')
                .send(data)
                .expect(200)
                .then(async (response) => {
                    const accessToken = JSON.parse(response.text)
                    await supertest(app)
                        .get(
                            '/api/auth/tweet_recharge?publicKey=0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2&twitterID=1539242622581379072'
                        )
                        .set(
                            'Authorization',
                            `Bearer ${accessToken.accessToken}`
                        )
                        .expect(200)

                    await supertest(app)
                        .get(
                            '/api/auth/tweet_recharge?publicKey=0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2&twitterID=1539242622581379072'
                        )
                        .set(
                            'Authorization',
                            `Bearer ${accessToken.accessToken}`
                        )
                        .expect(403)
                })
        })
}, 10000)
