const dbbClient  from '../ddbClient')
import {migrationRequestTable }  from '../../controller/libs/constants')

const DatabaseError  from '../../errors/database-error')

export default  async (publicKey) => {
    try {
        const params = {
            TableName: migrationRequestTable,
            IndexName: 'publicKey-index',
            KeyConditionExpression: 'publicKey = :p',
            ExpressionAttributeValues: {
                ':p': publicKey,
            },
        }

        const record = await dbbClient.query(params).promise()
        import {Items } = record
        return Items
    } catch (error) {
        throw new DatabaseError()
    }
}
