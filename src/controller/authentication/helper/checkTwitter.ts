import axios from 'axios'
import config from '../../../config'
export default async (publicKey: string, twitterID: string) => {
    try {
        const response = await axios.get(
            `https://api.twitter.com/2/tweets/${twitterID}`,
            {
                headers: {
                    Authorization: `Bearer ${config.twitter_api_key ?? ''}`,
                },
            }
        )

        const tweetContent = response.data.data.text
        return tweetContent.toLowerCase().includes(publicKey.toLowerCase())
    } catch (error) {
        return null
    }
}
