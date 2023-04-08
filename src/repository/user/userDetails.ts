import chalk from 'chalk'
import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'

export default async (usersPublicKey: string, network: string) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey:
          network === 'evm'
            ? usersPublicKey.trim().toLowerCase()
            : usersPublicKey,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ?? { fileCount: 0, message: '', network: '', refreshToken: '' }
  } catch (error: any) {
    console.log(
      chalk.yellow('User Detail Fetch Error: ') + chalk.red(error.message)
    )
    return null
  }
}
