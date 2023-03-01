import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'
import { generateToken } from '../../utils/randomToken'

interface IUserDetails {
    publicKey: string
    message: number
    dataLimit: number
    dataUsed: number
    apiKey: string
    refreshToken: string
    faucet: any
    network: string
    createdAt: number
    updatedAt: number
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
            Item: updatedDetails,
        }

        await dbbClient.put(params)
        return 'Put Successful'
    } catch (error) {
        console.log(error)
        throw new DatabaseError({})
    }
}
