import chalk from 'chalk'
import dbbClient from '../ddbClient'
import { ipnsTable } from '../../controller/libs/constants'

export default async (key: string) => {
    try {
        const params = {
            TableName: ipnsTable,
            Key: {
                ipnsName: key
            }
        }

        const status = await dbbClient.delete(params)
        return status
    } catch (error: any) {
        console.log('Delete IPNS Key Error: ' + error.message)
        return false
    }
}
