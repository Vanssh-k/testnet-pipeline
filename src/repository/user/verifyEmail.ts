import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import {
  generateRandomString,
  sendVerifyEmail,
} from '../../utils/sendEmailHelper'
import dbbClient from '../db/ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

const tempStorage = new JsonDB(new Config('temp.json', true, true, '/'))

const updateEmail = async (
  publicKey: string,
  contact: { email: string; isVerified: boolean }
) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set contact = :c, updatedAt = :u',
      ExpressionAttributeValues: {
        ':c': contact,
        ':u': Date.now(),
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new DatabaseError({})
  }
}

export const generateTokenAndSendMail = async (
  address: string,
  email: string
) => {
  const token = generateRandomString(64)
  tempStorage.push(`/verifytoken/${token}`, {
    address,
    email,
    isUsed: false,
    createdAt: Date.now(),
  })

  await Promise.all([
    // updateEmail(address, { email, isVerified: false }),
    sendVerifyEmail(
      email,
      `https://files.lighthouse.storage/verify?token=${token}`
    ),
  ])
  return { message: 'successful' }
}

export const verifyEmailToken = async (token: string) => {
  const data: any = tempStorage.getData(`/verifytoken/${token}`)
  if (Date.now() - data.createdAt > 15 * 60 * 1000) {
    throw new Error('This Token is expired')
  }
  if (!data.isUsed) {
    updateEmail(data.address, { email: data.address, isVerified: true })
    tempStorage.push(`/verifytoken/${token}`, {
      ...data,
      isUsed: true,
      createdAt: Date.now(),
    })
    return { message: 'verified' }
  } else {
    throw new Error('Token has already been used')
  }
}
