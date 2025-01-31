import { v4 } from 'uuid'
import cjs from 'crypto-js'

import { freeDataLimitInBytes, messageString } from '../../../config/constants.js'
import { setExCache, removeCache } from '../../../db/db/cacheClient.js'

import createApiKeyRecord from '../../../db/user/auth/createApiKeyRecord.js'
import getApiRecordById from '../../../db/user/auth/getApiRecordById.js'
import removeApiKey from '../../../db/user/auth/removeApiKey.js'
import userKeysRecord from '../../../db/user/auth/userKeysRecord.js'
import createNewUser from '../../../db/user/createNewUser.js'
import userDetails from '../../../db/user/userDetails.js'
import { sendMessageToEnc } from './encryption.js'
import { UserDetails } from '../../../types/user.js'
import getNetwork from '../../../middlewares/getNetwork.js'
import CustomError from '../../../middlewares/error/customError.js'

export const getMessage = async (publicKey: string, encryption: string): Promise<string> => {
  const network = getNetwork(publicKey)
  if (network === 'evm') {
    publicKey = publicKey.trim().toLowerCase()
  }

  const record = await userDetails(publicKey, network)
  const timestamp = Date.now()
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString('en-GB')
  const message = messageString + timestamp

  // New user
  if (!record) {
    const userRecord: UserDetails = {
      publicKey,
      message: timestamp,
      dataLimit: freeDataLimitInBytes,
      dataUsed: 0,
      fileCount: 0,
      network: network,
      email: 'null-' + v4(),
      createdAt: timestamp,
      updatedAt: timestamp,
      dataPartition: formattedDate,
    }

    await createNewUser(userRecord, network)
  }

  await setExCache(`message-${publicKey}`, 300, timestamp)
  if (`${encryption}`?.toLowerCase() === 'true') {
    await sendMessageToEnc(publicKey, message)
  }

  return message
}

export const signatureAuth = async (publicKey: string): Promise<UserDetails> => {
  const network = getNetwork(publicKey)
  if (network === 'evm') {
    publicKey = publicKey.trim().toLowerCase()
  }
  const record = await userDetails(publicKey, network)
  return record as UserDetails
}

export const createApiKey = async (publicKey: string, keyName: string) => {
  const prefix = v4().split('-')[0]
  const apiKey = prefix + '.' + v4().split('-').join('')
  const authDetails = {
    id: v4(),
    keyName: keyName,
    publicKey: publicKey,
    apiKey: cjs.SHA256(apiKey).toString(),
    keyPrefix: prefix,
    scope: 'admin',
    lastUpdate: Date.now(),
  }
  await createApiKeyRecord(authDetails)
  return apiKey
}

export const revokeApiKey = async (id: string, publicKey: string) => {
  const apiRecord: any = await getApiRecordById(id)
  console.log(apiRecord.publicKey)
  console.log(publicKey)
  if (apiRecord.publicKey !== publicKey) {
    throw new CustomError(403, 'Forbidden')
  }
  const status = await removeApiKey(id)
  return status
}

export const getUserKeys = async (publicKey: string) => {
  const data = await userKeysRecord(publicKey)
  return data
}
