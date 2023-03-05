import { ethers } from 'ethers'
import supertest from 'supertest'
import app from '../../../app'
import config from '../../../config'

test('List Migration Request: GET /list_migration_requests', async () => {
    await supertest(app)
        .get(
            '/api/lighthouse/list_migration_requests?publicKey=0xc88c729ef2c18baf1074ea0df537d61a54a8ce7b'
        )
        .expect(200)
        .then((response) => {
            const requestList = JSON.parse(response.text)
            expect(typeof requestList[0].migrationStatus).toBe('string')
        })
}, 30000)

test('Migration Request Info: GET /migration_request_info', async () => {
    await supertest(app)
        .get(
            '/api/lighthouse/migration_request_info?requestId=706da465-c11d-49c1-af80-5f2e74bc6821'
        )
        .expect(200)
        .then((response) => {
            const requestInfo = JSON.parse(response.text)
            expect(typeof requestInfo[0].cid).toBe('string')
        })
}, 30000)

test('Migration Request: POST /migration_request', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67475'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                config.test_wallet6_private_key ?? '',
                provider
            )
            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
                signedMessage,
                data: '["QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc"]',
            }

            await supertest(app)
                .post('/api/lighthouse/migration_request')
                .send(data)
                .expect(200)
                .then((response) => {
                    const res = JSON.parse(response.text)
                    expect(typeof res).toBe('object')
                })
        })
}, 10000)

test('Migration Request No CID: POST /migration_request', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67475'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                config.test_wallet6_private_key ?? '',
                provider
            )
            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
                signedMessage,
                data: '[]',
            }

            await supertest(app)
                .post('/api/lighthouse/migration_request')
                .send(data)
                .expect(400)
        })
}, 10000)

test('Migration Request Wrong CID: POST /migration_request', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0x75a22ede971080c8448c46de6ae5df3f64c67475'
        )
        .expect(200)
        .then(async (response) => {
            const verificationMessage = JSON.parse(response.text)
            const provider = ethers.getDefaultProvider()
            const signer = new ethers.Wallet(
                config.test_wallet6_private_key ?? '',
                provider
            )
            const signedMessage = await signer.signMessage(verificationMessage)
            const data = {
                publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
                signedMessage,
                data: '["QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2c"]',
            }

            await supertest(app)
                .post('/api/lighthouse/migration_request')
                .send(data)
                .expect(400)
        })
}, 10000)

// Enterprise
test('Migration Request: POST /migration_request_ent', async () => {
    const data = {
        publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
        enterprise: 'test_org',
        data: '["QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc"]',
    }

    await supertest(app)
        .post('/api/lighthouse/migration_request_ent')
        .set(
            'Authorization',
            `Bearer ${config.migration_test_access_token ?? ''}`
        )
        .send(data)
        .expect(200)
        .then((response) => {
            const res = JSON.parse(response.text)
            expect(typeof res).toBe('object')
        })
}, 10000)

test('Migration Request No CID: POST /migration_request', async () => {
    const data = {
        publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
        enterprise: 'test_org',
        data: '[]',
    }

    await supertest(app)
        .post('/api/lighthouse/migration_request')
        .set(
            'Authorization',
            `Bearer ${config.migration_test_access_token ?? ''}`
        )
        .send(data)
        .expect(400)
}, 10000)

test('Migration Request Wrong CID: POST /migration_request', async () => {
    const data = {
        publicKey: '0x75a22ede971080c8448c46de6ae5df3f64c67475',
        enterprise: 'test_org',
        data: '["QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2c"]',
    }

    await supertest(app)
        .post('/api/lighthouse/migration_request')
        .set(
            'Authorization',
            `Bearer ${config.migration_test_access_token ?? ''}`
        )
        .send(data)
        .expect(400)
}, 10000)
