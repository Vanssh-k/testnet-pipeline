import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, dataUsed: number) => {
    try {
        const params = {
            TableName: userTable,
            Key: {
                publicKey,
            },
            UpdateExpression: 'set dataUsed = :d, updatedAt = :u',
            ExpressionAttributeValues: {
                ':d': dataUsed,
                ':u': Date.now(),
            },
        }

        await dbbClient.update(params)
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError({})
    }
}
