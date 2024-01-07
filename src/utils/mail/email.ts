import nodemailer from 'nodemailer'
import config from '../../config'
import { VerifyMailTemplate } from './emailTemplate/verifyEmailTemplate'

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
    const data = await mailService.sendMail({
      from: 'no-reply@lighthouse.storage',
      sender: 'Lighthouse Storage',
      to,
      subject: 'Verify your email address',
      html: VerifyMailTemplate(verifyURL),
    })
    return data
  } catch (err) {
    console.log(err)
  }
}
