import axios from 'axios'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 300 }) // Set the cache TTL to 300 seconds (5 minutes)

export const getTicker = async (symbol: string) => {
  const cachedTicker = cache.get(symbol)
  if (cachedTicker) {
    return cachedTicker
  }
  const tokenPrices = (
    await axios.get(
      `https://data.messari.io/api/v1/assets/${symbol}/metrics/market-data`
    )
  ).data
  const tokenPricesUSD = tokenPrices.data.market_data.price_usd

  cache.set(symbol, tokenPricesUSD) // Cache the ticker value

  return tokenPricesUSD
}
