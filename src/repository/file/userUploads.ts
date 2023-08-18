import dbbClient from '../db/ddbClient'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { fileTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (usersPublicKey: string, pageNo: number) => {
  try {
    let records = null
    let count = 0
    let exclusiveStartKey = null
    if (pageNo < 1) {
      throw new DatabaseError()
    }
    do {
      const params: any = {
        TableName: fileTable,
        IndexName: 'publicKey-createdAt-index',
        ScanIndexForward: false,
        KeyConditionExpression: 'publicKey = :p',
        ExpressionAttributeValues: {
          ':p': { S: usersPublicKey },
        },
        Limit: 1000,
        ExclusiveStartKey: exclusiveStartKey,
      }

      records = await dbbClient.send(new QueryCommand(params))
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

    for (let i = 0; i < Items.length; i++) {
      Items[i] = unmarshall(Items[i])
    }
    return Items
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
