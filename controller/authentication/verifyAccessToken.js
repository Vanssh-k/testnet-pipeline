const SHA256 = require("crypto-js/sha256");

module.exports = (record, token) => {
  try {
    if (
      record["accessToken"] === SHA256(token).toString() ||
      record["apiKey"] === SHA256(token).toString()
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return null;
  }
};
