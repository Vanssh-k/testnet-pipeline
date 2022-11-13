const axios = require('axios');

exports.getTicker = async (symbol) => {
  try {
    const tokenPrices = (
      await axios.get(
        `https://data.messari.io/api/v1/assets/${symbol}/metrics/market-data`,
      )
    ).data;
    const tokenPricesUSD = tokenPrices.data.market_data.price_usd;
    return (tokenPricesUSD);
  } catch (error) {
    next(error);
  }
};
