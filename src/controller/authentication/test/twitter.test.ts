import { ethers } from 'ethers'
import app from '../../../app'
import supertest from 'supertest'
import config from '../../../config'

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
  const verificationMessage = JSON.parse(
    (
      await supertest(app).get(
        '/api/auth/get_message?publicKey=0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2'
      )
    ).text
  )
  const signer = new ethers.Wallet(config.test_wallet5_private_key)
  const signedMessage = await signer.signMessage(verificationMessage)
  const data = {
    publicKey: '0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2',
    signedMessage,
  }

  const accessToken = JSON.parse(
    (await supertest(app).post('/api/auth/verify_signer').send(data)).text
  )

  await supertest(app)
    .get(
      '/api/auth/tweet_recharge?publicKey=0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2&twitterID=1539242622581379072'
    )
    .set('Authorization', `Bearer ${accessToken.accessToken}`)
    .expect(200)

  await supertest(app)
    .get(
      '/api/auth/tweet_recharge?publicKey=0x43cb632f3dfc07f790ea93f9f9cf42f9a41400c2&twitterID=1539242622581379072'
    )
    .set('Authorization', `Bearer ${accessToken.accessToken}`)
    .expect(403)
}, 30000)
