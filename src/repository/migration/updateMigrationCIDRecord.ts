const dbbClient  from '../ddbClient')
import {migrationCIDs }  from '../../controller/libs/constants')
const DatabaseError  from '../../errors/database-error')

export default  async (id, data) => {
    try {
        const params = {
            TableName: migrationCIDs,
            Key: {
                id,
            },
            UpdateExpression: 'set userDataUpdated = :u',
            ExpressionAttributeValues: {
                ':u': data,
            },
        }

        await dbbClient.update(params).promise()
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
