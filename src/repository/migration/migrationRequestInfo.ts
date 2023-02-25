const dbbClient  from '../ddbClient')
import {migrationCIDs }  from '../../controller/libs/constants')

const DatabaseError  from '../../errors/database-error')

export default  async (requestID) => {
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
        import {Items } = record
        return Items
    } catch (error) {
        throw new DatabaseError()
    }
}
