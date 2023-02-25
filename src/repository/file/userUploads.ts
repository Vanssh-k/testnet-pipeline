import dbbClient from '../ddbClient'
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
                    ':p': usersPublicKey,
                },
                Limit: 20000,
                ExclusiveStartKey: exclusiveStartKey,
            }

            records = await dbbClient.query(params).promise()
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
        return Items
    } catch (error) {
        throw new DatabaseError()
    }
}
