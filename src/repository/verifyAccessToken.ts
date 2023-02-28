import SHA256 from 'crypto-js/sha256'
import { userTable } from '../controller/libs/constants'
import dbbClient from './ddbClient'

export default async (accessToken: string) => {
    try {
        const params = {
            TableName: userTable,
            FilterExpression: 'accessToken = :a',
            ExpressionAttributeValues: {
                ':a': SHA256(accessToken).toString(),
            },
        }

        const record = await dbbClient.scan(params)
        const Items = record.Items ?? []

        if (Items.length === 0) {
            return null
        }

        return {
            publicKey: Items[0].publicKey,
            dataLimit: Items[0].dataLimit,
            dataUsed: Items[0].dataUsed,
        }
    } catch (error) {
        return null
    }
}
