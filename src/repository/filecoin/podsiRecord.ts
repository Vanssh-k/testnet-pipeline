import dbbClient from '../db/ddbClient'
import DatabaseError from '../../errors/database-error'
import { filePODSI } from '../../controller/libs/constants'

export default async (pieceCID: string) => {
  try {
    const params = {
      TableName: filePODSI,
      IndexName: 'pieceCID-index',
      KeyConditionExpression: 'pieceCID = :p',
      ExpressionAttributeValues: {
        ':p': pieceCID,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
