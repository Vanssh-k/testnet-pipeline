// Third-party libraries
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import SHA256 from 'crypto-js/sha256'

// Local constants
import {
  freeDataLimitInBytes,
  messageString,
  cacheClearTime,
} from '../../libs/constants'

// Local errors
import { ForbiddenError } from '../../../errors'

// Local config
import config from '../../../config'

// Local DB
import { cacheFunction } from '../../../repository/db/cacheClient'

// Local user auth
import createApiKeyRecord from '../../../repository/user/auth/createApiKeyRecord'
import getApiRecordById from '../../../repository/user/auth/getApiRecordById'
import removeApiKey from '../../../repository/user/auth/removeApiKey'
import userKeysRecord from '../../../repository/user/auth/userKeysRecord'

// Local user
import refreshMessage from '../../../repository/user/refreshMessage'
import createNewUser from '../../../repository/user/createNewUser'
import _removeRefreshToken from '../../../repository/user/removeRefreshToken'

// Local encryption
import { sendMessageToEnc } from './encryption'

// Types
import { IUserDetails } from '../../../types/user'

export const getMessage = async (
  publicKey: string,
  network: string,
  record: IUserDetails | null,
  encryption: string
) => {
  if (network === 'evm') {
    publicKey = publicKey.trim().toLowerCase()
  }
  const timestamp = Date.now()
  const message = messageString + timestamp

  // New user
  if (!record) {
    const userRecord = {
      publicKey,
      message: timestamp,
      dataLimit: freeDataLimitInBytes,
      dataUsed: 0,
      fileCount: 0,
      faucet: {},
      network: network,
      profile: {},
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    await createNewUser(userRecord, network)
  } else {
    await refreshMessage(record.publicKey, timestamp)
  }

  if (`${encryption}`?.toLowerCase() === 'true') {
    await sendMessageToEnc(publicKey, message)
  }

  return message
}

export const verifySigner = async (record: IUserDetails) => {
  // Change the message and return access token
  refreshMessage(record.publicKey, Date.now())
  const payLoad = { publicKey: record.publicKey }
  const accessToken = jwt.sign(payLoad, config.jwt_secret, {
    algorithm: 'HS256',
    expiresIn: '12h',
  })
  const refreshToken = jwt.sign(payLoad, config.jwt_refresh_secret, {
    algorithm: 'HS256',
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}

export const refreshAccessToken = (record: IUserDetails) => {
  const payLoad = { publicKey: record.publicKey }
  const accessToken = jwt.sign(payLoad, config.jwt_secret, {
    algorithm: 'HS256',
    expiresIn: '12h',
  })
  const refreshToken = jwt.sign(payLoad, config.jwt_refresh_secret, {
    algorithm: 'HS256',
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}

export const createApiKey = async (record: IUserDetails, keyName: string) => {
  const prefix = v4().split('-')[0]
  const apiKey = prefix + '.' + v4().split('-').join('')
  const authDetails = {
    id: v4(),
    keyName: keyName,
    publicKey: record.publicKey,
    apiKey: SHA256(apiKey).toString(),
    keyPrefix: prefix,
    scope: 'admin',
    lastUpdate: Date.now(),
  }
  const createRecord = await createApiKeyRecord(authDetails)
  return apiKey
}

export const revokeApiKey = async (id: string, publicKey: string) => {
  const apiRecord: any = await getApiRecordById(id)
  if (apiRecord.publicKey !== publicKey) {
    throw new ForbiddenError()
  }
  const status = await removeApiKey(id)
  return status
}

export const getUserKeys = async (publicKey: string) => {
  const data = await userKeysRecord(publicKey)
  return data
}
