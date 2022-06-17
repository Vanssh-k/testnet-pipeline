const dbbClient = require("../libs/ddbClient");

module.exports = async (updatedDetails) => {
  try {
    updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase();
    const params = {
      TableName: "UsersTesting",
      Item: updatedDetails,
    };

    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error) {
    return null;
  }
};
