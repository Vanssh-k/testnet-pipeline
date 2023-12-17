import NodeCache from 'node-cache'
import {
  generateRandomString,
  sendVerifyEmail,
} from '../../../utils/mail/email'
import updateEmail from '../../../repository/user/updateEmail'

const cache = new NodeCache({ stdTTL: 300 }) // Set the cache TTL to 300 seconds (5 minutes)

export const generateTokenAndSendMail = async (
  address: string,
  email: string
) => {
  const token = generateRandomString(64)
  cache.set(`verifytoken/${token}`, {
    address,
    email,
    isUsed: false,
    createdAt: Date.now(),
  })

  await sendVerifyEmail(
    email,
    `https://files.lighthouse.storage/verify?token=${token}`
  )
  return { message: 'successful' }
}

export const verifyEmailToken = async (token: string) => {
  const data: any = cache.get(`verifytoken/${token}`)
  console.log(data)
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
