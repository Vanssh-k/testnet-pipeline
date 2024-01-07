import { sendVerificationEmail } from '../email'

describe('email', () => {
  test('sendVerifyEmail', async () => {
    const data: any = await sendVerificationEmail(
      ['ravish@lighthouse.storage'],
      'https://files.lighthouse.storage?token=1716341281905943012'
    )
    expect(data.accepted.length).toBeGreaterThan(0)
  }, 30000)
})
