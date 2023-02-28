import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'
import { generateToken } from '../../utils/randomToken'

interface IUserDetails {
    publicKey: string
    apiKey: string
}

export default async (updatedDetails: IUserDetails, network: string) => {
    try {
        if (network === 'evm') {
            updatedDetails.publicKey = updatedDetails.publicKey
                .trim()
                .toLowerCase()
        }

        // Secondary Index null case
        if (updatedDetails.apiKey === '') {
            updatedDetails.apiKey = generateToken()
        }

        const params = {
            TableName: userTable,
            Item: { updatedDetails },
        }

        await dbbClient.put(params)
        return 'Put Successful'
    } catch (error) {
        throw new DatabaseError({})
    }
}
