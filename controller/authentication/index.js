const { tweetRecharge } = require('./helper/tweetHelper');
const {
  getMessage, verifySigner, refreshAccessToken, removeRefreshToken, getApiKey,
} = require('./helper/authHelper');

// Get message - user will sign this message to verify himself
exports.get_message = async (req, res, next) => {
  try {
    const message = await getMessage(req.query.publicKey, req.network, req.user);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// Return access token if user is authentic
exports.verify_signer = async (req, res, next) => {
  try {
    const record = req.user;
    const token = await verifySigner(record);
    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

// Return if user is authentic along with his data usage
exports.verify_access_token = async (req, res, next) => {
  try {
    const record = req.user;

    res.status(200).json({
      publicKey: record.publicKey,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh_access_token = async (req, res, next) => {
  try {
    const newAccessToken = refreshAccessToken(req.user);
    res.status(200).json(newAccessToken);
  } catch (error) {
    next(error);
  }
};

exports.remove_refresh_token = async (req, res, next) => {
  try {
    const response = removeRefreshToken(req.user);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.get_api_key = async (req, res, next) => {
  try {
    const apiKey = await getApiKey(req.user);
    res.status(200).json(apiKey);
  } catch (error) {
    next(error);
  }
};

exports.verify_api_key = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json({
      publicKey: record.publicKey,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

exports.tweet_recharge = async (req, res, next) => {
  try {
    const _ = await tweetRecharge(req.user, req.query.twitterID);
    res.status(200).json('Data Limit Upgraded');
  } catch (error) {
    next(error);
  }
};
