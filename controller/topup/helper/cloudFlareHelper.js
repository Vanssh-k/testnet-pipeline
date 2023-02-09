const axios = require('axios')

const addDNSRecord = async (name) => {
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

        console.log(response.data.result)
        console.log(response.data.result.name)
        return 'success'
    } catch (error) {
        console.log(error.response.data.errors)
        throw new Error()
    }
}

module.exports = { addDNSRecord }
