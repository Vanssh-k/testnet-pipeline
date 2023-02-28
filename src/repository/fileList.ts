import dbbClient from './ddbClient'
import { fileTableEncryption } from '../controller/libs/constants'

export default async (publicKey: any) => {
    try {
        const params = {
            TableName: fileTableEncryption,
            FilterExpression: 'publicKey = :p',
            ExpressionAttributeValues: {
                ':p': publicKey.toLowerCase(),
            },
        }

        const record = await dbbClient.scan(params)
        return record.Items ?? []
    } catch (error) {
        return null
    }
}
