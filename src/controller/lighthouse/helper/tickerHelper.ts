import axios from 'axios'
import { setExCache, getCache } from '../../../db/db/cacheClient.js'

export const getTicker = async (symbol: string) => {
  const cachedTicker = await getCache(symbol)

  if (cachedTicker) {
    return cachedTicker
  }
  const tokenPrices = (await axios.get(`https://data.messari.io/api/v1/assets/${symbol}/metrics/market-data`)).data
  const tokenPricesUSD = tokenPrices.data.market_data.price_usd

  setExCache(symbol, 300, tokenPricesUSD) // Cache the ticker value

  return tokenPricesUSD
}
