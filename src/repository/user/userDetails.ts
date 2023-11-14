import chalk from 'chalk'
import dbbClient from '../db/ddbClient'
import { userTable } from '../../controller/libs/constants'
import logger from '../../utils/logger'

export default async (usersPublicKey: string, network: string) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey:
          network === 'evm'
            ? usersPublicKey.trim().toLowerCase()
            : usersPublicKey,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ?? null
  } catch (error: any) {
    const myLogger = logger('error', 'authentication')
    myLogger.error('User Detail Fetch Error: ' + error.message)
    return null
  }
}
