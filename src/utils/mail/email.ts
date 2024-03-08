import nodemailer from 'nodemailer'
import config from '../../config'

const mailService = nodemailer.createTransport({
  host: 'mail.gandi.net',
  port: 587,
  auth: {
    user: config.no_reply_email,
    pass: config.no_reply_email_password,
  },
})

export function generateRandomString(length: number = 32): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

export const sendVerificationEmail = async (
  to: string | string[],
  verifyURL: string
) => {
  try {
    const plainTextContent = `Hello,\nPlease verify your email address by visiting the following link:\n${verifyURL}\n\nThe verification link will expire in an hour. If you have any questions, do reach out to us on Discord  we're always happy to help you out.
    \nThanks,\nTeam Lighthouse`
    const data = await mailService.sendMail({
      from: 'no-reply@lighthouse.storage',
      sender: 'Lighthouse Storage',
      to,
      text: plainTextContent,
      subject: 'Verify your email address',
    })
    return data
  } catch (err) {
    console.log(err)
  }
}
