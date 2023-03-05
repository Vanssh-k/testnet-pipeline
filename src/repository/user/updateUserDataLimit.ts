import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, dataLimit: number) => {
    try {
        const params = {
            TableName: userTable,
            Key: {
                publicKey,
            },
            UpdateExpression: 'set dataLimit = :d, updatedAt = :u',
            ExpressionAttributeValues: {
                ':d': dataLimit,
                ':u': Date.now(),
            },
        }

        await dbbClient.update(params)
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError({})
    }
}
