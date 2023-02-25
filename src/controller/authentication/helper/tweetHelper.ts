import checkTwitter from './checkTwitter'
import faucetRecharge from '../../../repository/user/faucetRecharge'
import { freeDataLimitInBytes } from '../../libs/constants'
import { ForbiddenError } from '../../../errors'

export const tweetRecharge = async (record: any, twitterID: string) => {
    // Check if user have already used faucet
    if (record.faucet.twitter === 'used') {
        throw new ForbiddenError()
    }

    // Check for validity of tweet
    const validTweet = await checkTwitter(record.publicKey, twitterID)
    if (!validTweet) {
        throw new ForbiddenError()
    }

    const updatedLimit = parseInt(record.dataLimit, 10) + freeDataLimitInBytes
    await faucetRecharge(record.publicKey, updatedLimit, {
        twitter: 'used',
    })
    return 'Recharge Success'
}
