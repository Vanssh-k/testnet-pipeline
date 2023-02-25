const supertest  from 'supertest')
const app  from '../../../app')

test('EVM Message: GET /get_message', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=0xA3C960B3BA29367ecBCAf1430452C6cd7516F588'
        )
        .expect(200)
        .then((response) => {
            const message = JSON.parse(response.text)
            expect(typeof message).toBe('string')
        })
}, 10000)

test('Solana Message: GET /get_message', async () => {
    await supertest(app)
        .get(
            '/api/auth/get_message?publicKey=J7wvyu9x2vzAssgkNKi4hHdfuJaJAHZV9RxXPrsbkLEK'
        )
        .expect(200)
        .then((response) => {
            const message = JSON.parse(response.text)
            expect(typeof message).toBe('string')
        })
}, 10000)
