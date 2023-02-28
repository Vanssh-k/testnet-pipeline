import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const addDNSRecord = async (name: string) => {
    try {
        const data = {
            type: 'CNAME',
            name,
            content: 'd29058osuk1s9m.cloudfront.net',
            ttl: 1,
        }
        const response = await axios.post(
            'https://api.cloudflare.com/client/v4/zones/bcf4dff6127347482ae26dcf86aa631b/dns_records',
            data,
            {
                headers: {
                    'Content-type': 'application/json',
                    'X-Auth-Email': 'ravish@lighthouse.storage',
                    Authorization: `Bearer ${process.env.CLOUDFLARE_KEY}`,
                },
            }
        )

        return 'success'
    } catch (error: any) {
        console.log(error.response.data.errors)
        throw new Error()
    }
}

export { addDNSRecord }
