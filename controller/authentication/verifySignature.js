const ethers = require("ethers");

module.exports = (usersPublicKey, originalMessage, signedMessage) => {
  try {
    const sig = ethers.utils.splitSignature(signedMessage);
    const publicKeyToVerify = ethers.utils
      .verifyMessage(originalMessage, sig)
      .toLowerCase();
    if (usersPublicKey.toLowerCase() === publicKeyToVerify) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
