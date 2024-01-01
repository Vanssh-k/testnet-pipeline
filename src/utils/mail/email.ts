import nodemailer from 'nodemailer'
import config from '../../config'
import { VerifyMailTemplate } from './emailTemplate/verifyEmailTemplate'

const mailService = nodemailer.createTransport({
  service: 'gmail',
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

export const sendVerifyEmail = async (
  to: string | string[],
  verifyURL: string
) => {
  const data = await mailService.sendMail({
    from: 'Lighthouse',
    sender: 'Lighthouse Storage',
    to,
    subject: 'Verify your email address',
    html: VerifyMailTemplate(verifyURL),
  })
  return data
}
