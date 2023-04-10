import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import SHA256 from 'crypto-js/sha256'
import { ForbiddenError } from '../../../errors'
import { cacheFunction } from '../../../repository/cacheClient'
import removeApiKey from '../../../repository/user/auth/removeApiKey'
import userKeysRecord from '../../../repository/user/auth/userKeysRecord'
import { freeDataLimitInBytes, messageString, cacheClearTime } from '../../libs/constants'
import updateUserDetails from '../../../repository/user/updateUserDetails'
import _removeRefreshToken from '../../../repository/user/removeRefreshToken'
import getApiRecordById from '../../../repository/user/auth/getApiRecordById'
import createApiKeyRecord from '../../../repository/user/auth/createApiKeyRecord'

export const getMessage = async (
  publicKey: string,
  network: string,
  record: any
) => {
  const timestamp = Date.now()
  const message = messageString + timestamp

  const updatedDetails = {
    publicKey,
    message: timestamp,
    dataLimit: record.dataLimit ? record.dataLimit : freeDataLimitInBytes,
    dataUsed: record.dataUsed ? record.dataUsed : 0,
    fileCount: record.fileCount ? record.fileCount : 0,
    faucet: record?.faucet ? record.faucet : {},
    network: record.network ? record.network : network,
    createdAt: record.createdAt ? record.createdAt : timestamp,
    updatedAt: timestamp,
  }
  if (network === 'evm') {
    updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase()
  }

  await cacheFunction(
    async () => updateUserDetails(updatedDetails, network),
    `user-${updatedDetails.publicKey}`,
    cacheClearTime.day
  )
  return message
}

export const verifySigner = async (record: any) => {
  // Change the message and return access token
  const payLoad = { publicKey: record.publicKey }
  const accessToken = jwt.sign(payLoad, config.jwt_secret, {
    algorithm: 'HS256',
    expiresIn: '12h',
  })
  const refreshToken = jwt.sign(
    payLoad,
    config.jwt_refresh_secret,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
    }
  )

  return { accessToken, refreshToken }
}

export const refreshAccessToken = (record: any) => {
  const payLoad = { publicKey: record.publicKey }
  const accessToken = jwt.sign(payLoad, config.jwt_secret, {
    algorithm: 'HS256',
    expiresIn: '12h',
  })
  const refreshToken = jwt.sign(
    payLoad,
    config.jwt_refresh_secret,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
    }
  )

  return { accessToken, refreshToken }
}

export const createApiKey = async (record: any, keyName: string) => {
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
