import dbbClient from '../ddbClient'
import DatabaseError from '../../errors/database-error'
import { filecoinDealRecords } from '../../controller/libs/constants'

export default async (bundleId: string) => {
    try {
        const params = {
            TableName: filecoinDealRecords,
            IndexName: 'bundleId-index',
            KeyConditionExpression: 'bundleId = :b',
            ExpressionAttributeValues: {
                ':b': bundleId,
            },
        }

        const record = await dbbClient.query(params)
        return record.Items ?? []
    } catch (error) {
        throw new DatabaseError()
    }
}
