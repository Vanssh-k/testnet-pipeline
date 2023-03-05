import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, message: string, apiKey: string) => {
    try {
        const params = {
            TableName: userTable,
            Key: {
                publicKey,
            },
            UpdateExpression: 'set message = :m, updatedAt = :u, apiKey = :a',
            ExpressionAttributeValues: {
                ':a': apiKey,
                ':m': message,
                ':u': Date.now(),
            },
        }

        await dbbClient.update(params)
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
