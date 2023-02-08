const verifySignature = require('./verifySignature')
const { generateToken } = require('./randomToken')

describe('utils', () => {
    test('generateRandomToken', () => {
        const token = generateToken()
        expect(typeof token).toBe("string")
    }, 10000)
    test('Verify Signature Main Case: signature verification function', () => {
        const verify = verifySignature(
            '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1',
            'cb3b3bc6-51f8-4e2a-a0de-56fb563f5232',
            '0x431e27c431b6fee465356c4e895b4ea67b8bd400132ac2bdf94c29058779e8930a160b501907796866ba34c79f6824a8a3376dcd5e742005c710eff923acbb1d1b'
        )

        expect(verify).toBe(true)
    }, 10000)

    test('Verify Signature Catch Case: signature verification function', () => {
        const verify = verifySignature(
            '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1',
            'cb3b3bc6-51f8-4e2a-a0de-56fb563f5232',
            ' 0x431e27c431b6fee465356c4e895b4ea67b8bd400132ac2bdf94c29058779e8930a160b501907796866ba34c79f6824a8a3376dcd5e742005c710eff923acbb1d1b'
        )

        expect(verify).toBe(false)
    }, 10000)

    test('Verify Signature Not Verified Case: signature verification function', () => {
        const verify = verifySignature(
            '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A2',
            'cb3b3bc6-51f8-4e2a-a0de-56fb563f5232',
            '0x431e27c431b6fee465356c4e895b4ea67b8bd400132ac2bdf94c29058779e8930a160b501907796866ba34c79f6824a8a3376dcd5e742005c710eff923acbb1d1b'
        )

        expect(verify).toBe(false)
    }, 10000)
})
