import dbbClient from '../ddbClient'
import DatabaseError from '../../errors/database-error'
import { fileBundleRecords } from '../../controller/libs/constants'

export default async (cid: string) => {
    try {
        const params = {
            TableName: fileBundleRecords,
            IndexName: 'cid-index',
            KeyConditionExpression: 'cid = :c',
            ExpressionAttributeValues: {
                ':c': cid,
            },
        }

        const record = await dbbClient.query(params).promise()
        return record.Items ?? []
    } catch (error) {
        throw new DatabaseError()
    }
}
