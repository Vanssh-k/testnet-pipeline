import nodemailer from 'nodemailer'
import config from '../config'
import { VerifyMailTemplate } from './emailTemplate/verifyEmail'

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

export const sendMail = async (
  title: string,
  to: string | string[],
  mail: string
) => {
  const data = await mailService.sendMail({
    from: 'Lighthouse',
    sender: 'Lighthouse Storage',
    to,
    subject: title,
    html: mail,
  })
  return data
}

export const sendVerifyEmail = async (
  to: string | string[],
  verifyURL: string
) => {
  return sendMail('Verify Email', to, VerifyMailTemplate(verifyURL))
}
