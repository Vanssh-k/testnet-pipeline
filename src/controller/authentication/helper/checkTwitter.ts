import axios from 'axios'

export default async (publicKey: string, twitterID: string) => {
    try {
        const response = await axios.get(
            `https://api.twitter.com/2/tweets/${twitterID}`,
            {
                headers: {
                    Authorization: `Bearer ${
                        process.env.TWITTER_API_KEY ?? ''
                    }`,
                },
            }
        )

        const tweetContent = response.data.data.text
        return tweetContent.toLowerCase().includes(publicKey.toLowerCase())
    } catch (error) {
        return null
    }
}
