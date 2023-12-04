import { sendVerifyEmail } from '../sendEmailHelper'

describe('email', () => {
  test('sendVerifyEmail', async () => {
    const data = await sendVerifyEmail(
      ['ayobami@lighthouse.storage'],
      'https://files.lighthouse.storage?token=1716341281905943012'
    )
    expect(data.accepted.length).toBeGreaterThan(0)
  })
})
