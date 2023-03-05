import supertest from 'supertest'
import app from '../../../app'

// get_ticker
test('Polygon Ticker: GET /get_ticker', async () => {
    await supertest(app)
        .get('/api/lighthouse/get_ticker?symbol=matic')
        .expect(200)
        .then((response) => {
            const ticker = JSON.parse(response.text)
            expect(typeof ticker).toBe('number')
        })
}, 30000)

test('Fantom Ticker: GET /get_ticker', async () => {
    await supertest(app)
        .get('/api/lighthouse/get_ticker?symbol=ftm')
        .expect(200)
        .then((response) => {
            const ticker = JSON.parse(response.text)
            expect(typeof ticker).toBe('number')
        })
}, 30000)

test('Binance Ticker: GET /get_ticker', async () => {
    await supertest(app)
        .get('/api/lighthouse/get_ticker?symbol=bnb')
        .expect(200)
        .then((response) => {
            const ticker = JSON.parse(response.text)
            expect(typeof ticker).toBe('number')
        })
}, 30000)

test('Ticker Catch Case: GET /get_ticker', async () => {
    await supertest(app).get('/api/lighthouse/get_ticker?symbol=et').expect(400)
}, 30000)
