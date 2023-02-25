import dbbClient from '../ddbClient'
import DatabaseError from '../../errors/database-error'
const fileBundleRecords = 'file-bundle-records'

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
        const { Items } = record
        return Items
    } catch (error) {
        throw new DatabaseError()
    }
}
