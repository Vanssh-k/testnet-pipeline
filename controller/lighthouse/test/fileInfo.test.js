const supertest = require('supertest')
const app = require('../../../app')

test('File Info: GET /file_info', async () => {
    await supertest(app)
        .get(
            '/api/lighthouse/file_info?cid=QmWWkks3aHf1pyygat1o2QEGmZMagCJVCa388UxiSNbvEN'
        )
        .expect(200)
        .then((response) => {
            const info = JSON.parse(response.text)
            expect(typeof info.cid).toBe('string')
        })
}, 30000)
