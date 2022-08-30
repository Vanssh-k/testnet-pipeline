const dbbClient = require("./ddbClient");
const { userTable } = require("../controller/libs/constants");

module.exports = async (updatedDetails) => {
  try {
    updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase();
    const params = {
      TableName: userTable,
      Item: updatedDetails,
    };

    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error) {
    return null;
  }
};
