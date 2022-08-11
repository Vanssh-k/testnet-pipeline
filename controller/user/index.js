const jwt = require("jsonwebtoken");
const userDetails = require("../authentication/userDetails");
const fileDetails = require("./fileDetails");

const AuthenticationError = require("../../errors/authentication-error");
const NotFoundError = require("../../errors/not-found-error");

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
    const record = await userDetails(req.query.publicKey);
    if (!record) {
      throw new NotFoundError();
    }

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
    console.log(userData)
    return userData;
  } catch {
    return null;
  }
};

exports.faucet_status = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const userData = verifyJWT(token, process.env.JWT_SECRET);
    if (!userData) {
      throw new AuthenticationError();
    }

    const record = await userDetails(userData.publicKey);
    res.status(200).json(record["faucet"]);
  } catch (error) {
    next(error);
  }
};
