const Redis = require("ioredis");

const redis = new Redis();

module.exports.setCache = async (key, value) => {
  return redis.set(key, JSON.stringify(value));
};

module.exports.getCache = async (key) => {
  if (redis.status == "ready") {
    return redis
      .get(key)
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
  return null;
};

module.exports.removeCache = async (key) => {
  if (redis.status == "ready") {
    return redis
      .del(key)
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
  return null;
};

module.exports.cacheFunction = async (fn, key) => {
  if (redis.status == "ready") {
    let data = await this.getCache(key);
    if (data) {
      return data;
    }
  }
  data = await fn();
  if (redis.status == "ready") {
    await this.setCache(key, data);
  }
  return data;
};

module.exports.clearCacheStartsWith = async (keyword) => {
  if (redis.status == "ready") {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        `${keyword}*`
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } while (cursor !== "0");
  }
  return null;
};
