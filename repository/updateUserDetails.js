const { v4: uuidv4 } = require("uuid");
const dbbClient = require("./ddbClient");
const SHA256 = require("crypto-js/sha256");
const { userTable } = require("../controller/libs/constants");

module.exports = async (updatedDetails, network) => {
  try {
    if(network==="evm"){
      updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase();
    }
    
    // Secondary Index null case
    if(updatedDetails.apiKey === ""){
      updatedDetails.apiKey = SHA256(uuidv4().toString()).toString();
    }

    const params = {
      TableName: userTable,
      Item: updatedDetails,
    };

    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error) {
    console.error(error);
    return null;
  }
};
