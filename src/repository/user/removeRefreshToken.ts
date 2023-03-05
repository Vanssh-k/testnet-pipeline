import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, refreshToken: string) => {
    try {
        const params = {
            TableName: userTable,
            Key: {
                publicKey,
            },
            UpdateExpression: 'set refreshToken = :r, updatedAt = :u',
            ExpressionAttributeValues: {
                ':r': refreshToken,
                ':u': Date.now(),
            },
        }

        await dbbClient.update(params)
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
