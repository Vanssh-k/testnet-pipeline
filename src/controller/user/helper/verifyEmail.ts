import { v4 } from 'uuid'
import { sendEmail } from '../../../utils/sendEmail.js'
import { setExCache, getCache } from '../../../db/db/cacheClient.js'
import updateEmail from '../../../db/user/updateEmail.js'
import CustomError from '../../../middlewares/error/customError.js'

export const generateTokenAndSendMail = async (address: string, email: string): Promise<void> => {
  const token = v4().split('-').join('')

  const lastMailByUser = getCache(`lastMailByUser/${address}`)
  if (!lastMailByUser) {
    throw new CustomError(400, 'Wait for two min before sending another mail.')
  }

  setExCache(`lastMailByUser/${address}`, 120, Date.now())
  setExCache(`verifytoken/${token}`, 300, {
    address,
    email,
    isUsed: false,
    createdAt: Date.now(),
  })

  const plainTextContent = `Hello,\nPlease verify your email address by visiting the following link:\nhttps://files.lighthouse.storage/verify?token=${token}\n\nThe verification link will expire in an hour. If you have any questions, do reach out to us on Discord  we're always happy to help you out.
    \nThanks,\nTeam Lighthouse`
  await sendEmail(email, 'Verify your email address', plainTextContent)
}

export const verifyEmailToken = async (token: string): Promise<{ message: string }> => {
  const data: any = await getCache(`verifytoken/${token}`)
  if (!data) {
    throw new Error('This Token is expired')
  }
  if (!data.isUsed) {
    updateEmail(data.address, data.email)
    return { message: 'verified' }
  } else {
    throw new Error('Token has already been used')
  }
}
