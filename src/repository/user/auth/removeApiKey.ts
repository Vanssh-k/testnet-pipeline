import dbbClient from '../../db/ddbClient'
import { userAuthTable } from '../../../controller/libs/constants'
import logger from '../../../utils/logger'

export default async (id: string) => {
  try {
    const params = {
      TableName: userAuthTable,
      Key: {
        id: id,
      },
    }

    const status = await dbbClient.delete(params)
    return status
  } catch (error: any) {
    const myLogger = logger('error', 'authentication')
    myLogger.error('In removeAPIKey: ' + error.message)
    return false
  }
}
