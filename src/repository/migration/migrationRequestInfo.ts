import dbbClient from '../ddbClient'
import { migrationCIDs } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (requestID: string) => {
    try {
        const params = {
            TableName: migrationCIDs,
            IndexName: 'requestID-index',
            KeyConditionExpression: 'requestID = :r',
            ExpressionAttributeValues: {
                ':r': requestID,
            },
        }

        const record = await dbbClient.query(params).promise()
        const Items = record.Items ?? []
        return Items
    } catch (error) {
        throw new DatabaseError()
    }
}
