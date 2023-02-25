import dbbClient from '../ddbClient'
import { userTransactions } from '../../controller/libs/constants'

export const getUserTransactions = async (publicKey: string) => {
    try {
        const params = {
            TableName: userTransactions,
            FilterExpression: 'publicKey = :p',
            ExpressionAttributeValues: {
                ':p': publicKey.toLowerCase(),
            },
        }

        const record = await dbbClient.scan(params).promise()
        const Items = record.Items ?? []
        return Items
    } catch (error) {
        return null
    }
}

export const recordTransactions = async (record: any) => {
    try {
        const params = {
            TableName: userTransactions,
            Item: record,
        }

        return await dbbClient.put(params).promise()
    } catch (error) {
        return null
    }
}
