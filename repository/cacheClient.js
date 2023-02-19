const redis = require('redis');
const client = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
});

module.exports.setCache = async (key, value) => {
    return client.set(key, JSON.stringify(value))
}

module.exports.getCache = async (key) => {
    if (client.status === 'ready') {
        return client
            .get(key)
            .then((result) => {
                return JSON.parse(result)
            })
            .catch((err) => {
                console.error(err)
                return null
            })
    }
    return null
}

module.exports.removeCache = async (key) => {
    if (client.status === 'ready') {
        return client
            .del(key)
            .then((result) => {
                return JSON.parse(result)
            })
            .catch(() => {
                return null
            })
    }
    return null
}

module.exports.cacheFunction = async (fn, key) => {
    if (client.status === 'ready') {
        const data = await this.getCache(key)
        if (data) {
            return data
        }
    }
    const data = await fn()
    if (client.status === 'ready') {
        await this.setCache(key, data)
    }
    return data
}

module.exports.clearCacheStartsWith = async (keyword) => {
    if (client.status === 'ready') {
        let cursor = '0'
        do {
            // eslint-disable-next-line no-await-in-loop
            const [nextCursor, keys] = await client.scan(
                cursor,
                'MATCH',
                `${keyword}*`
            )
            cursor = nextCursor
            if (keys.length > 0) {
                // eslint-disable-next-line no-await-in-loop
                await client.del(keys)
            }
        } while (cursor !== '0')
    }
    return null
}
