const jwt = require("jsonwebtoken");

module.exports.verifyJWT = (accessToken, secret) => {
  try {
    const userData = jwt.verify(accessToken, secret);
    return userData;
  } catch {
    return null;
  }
};
