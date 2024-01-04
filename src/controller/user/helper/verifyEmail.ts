import NodeCache from 'node-cache'
import {
  generateRandomString,
  sendVerificationEmail,
} from '../../../utils/mail/email'
import updateEmail from '../../../repository/user/updateEmail'

const cache = new NodeCache({ stdTTL: 3600 }) // Set the cache TTL to 3600 seconds (1 hour)

export const generateTokenAndSendMail = async (
  address: string,
  email: string
) => {
  const token = generateRandomString(64)
  const lastMailByUser: any = cache.get(`lastMailByUser/${address}`)
  if (lastMailByUser) {
    if ((Date.now() - lastMailByUser) / 1000 < 120) {
      throw new Error('Wait for two min before sending another mail!!!')
    }
  }

  cache.set(`lastMailByUser/${address}`, Date.now())
  cache.set(`verifytoken/${token}`, {
    address,
    email,
    isUsed: false,
    createdAt: Date.now(),
  })

  await sendVerificationEmail(
    email,
    `https://files.lighthouse.storage/verify?token=${token}`
  )
  return { message: 'successful' }
}

export const verifyEmailToken = async (token: string) => {
  const data: any = cache.get(`verifytoken/${token}`)
  if (!data) {
    throw new Error('This Token is expired')
  }
  if (!data.isUsed) {
    updateEmail(data.address, { email: data.email })
    return { message: 'verified' }
  } else {
    throw new Error('Token has already been used')
  }
}
