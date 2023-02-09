const checkTwitter = require('./checkTwitter')
const faucetRecharge = require('../../../repository/user/faucetRecharge')
const { freeDataLimitInBytes } = require('../../libs/constants')

const ForbiddenError = require('../../../errors/forbidden')

exports.tweetRecharge = async (record, twitterID) => {
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
