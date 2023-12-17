import dbbClient from '../db/ddbClient'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { fileTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (usersPublicKey: string, pageNo: number) => {
  try {
    let records = null
    let count = 0
    let exclusiveStartKey = undefined
    if (pageNo < 1) {
      throw new DatabaseError()
    }
    do {
      const params: any = {
        TableName: fileTable,
        IndexName: 'publicKey-createdAt-index',
        KeyConditionExpression: 'publicKey = :p',
        ExpressionAttributeValues: {
          ':p': usersPublicKey,
        },
        Limit: 1000,
        ExclusiveStartKey: exclusiveStartKey,
      }

      records = await dbbClient.query(params)
      count += 1
      exclusiveStartKey = records.LastEvaluatedKey
      if (!exclusiveStartKey && pageNo > count) {
        records = {
          Items: [],
        }
        break
      }
    } while (count !== pageNo)

    const { Items } = records
    if (!Items) {
      return []
    }

    return Items
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
