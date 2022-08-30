const jwt = require("jsonwebtoken");
const fileDetails = require("../../repository/fileDetails");

exports.get_uploads = async (req, res, next) => {
  try {
    const files = await fileDetails(req.query.publicKey);
    res.status(200).send(files);
  } catch (error) {
    next(error);
  }
};

exports.user_data_usage = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json({
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

const verifyJWT = (accessToken, secret) => {
  try {
    const userData = jwt.verify(accessToken, secret);
    console.log(userData);
    return userData;
  } catch {
    return null;
  }
};

exports.faucet_status = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json(record["faucet"]);
  } catch (error) {
    next(error);
  }
};
