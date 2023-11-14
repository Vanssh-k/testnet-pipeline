import dbbClient from '../../db/ddbClient'
import { IUserAuthDetails } from '../../../types/user'
import { userAuthTable } from '../../../controller/libs/constants'
import DatabaseError from '../../../errors/database-error'
import logger from '../../../utils/logger'

export default async (authDetails: IUserAuthDetails) => {
  try {
    const params = {
      TableName: userAuthTable,
      Item: authDetails,
    }

    await dbbClient.put(params)
    return 'Put Successful'
  } catch (error: any) {
    const myLogger = logger('error', 'authentication')
    myLogger.error('In createAPIKey: ' + error.message)
    throw new DatabaseError('Failed creating API Key')
  }
}
