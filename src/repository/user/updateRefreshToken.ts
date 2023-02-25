import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (
    publicKey: string,
    message: string,
    refreshToken: string
) => {
    try {
        const params = {
            TableName: userTable,
            Key: {
                publicKey,
            },
            UpdateExpression:
                'set message = :m, refreshToken = :r, updatedAt = :u',
            ExpressionAttributeValues: {
                ':m': message,
                ':r': refreshToken,
                ':u': Date.now(),
            },
        }

        await dbbClient.update(params).promise()
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError({})
    }
}
