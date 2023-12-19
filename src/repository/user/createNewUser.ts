import { IUserDetails } from '../../types/user'
import DatabaseError from '../../errors/database-error'
import { userTable } from '../../controller/libs/constants'
import dbbClient from '../db/ddbClient'
import logger from '../../utils/logger'

export default async (updatedDetails: IUserDetails, network: string) => {
  try {
    if (network === 'evm') {
      updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase()
    }

    const params = {
      TableName: userTable,
      Item: updatedDetails,
    }

    await dbbClient.put(params)
    return 'Put Successful'
  } catch (error: any) {
    const myLogger = logger('error', 'authentication')
    myLogger.error('Error update user details: ' + error.message)
    throw new DatabaseError({})
  }
}
