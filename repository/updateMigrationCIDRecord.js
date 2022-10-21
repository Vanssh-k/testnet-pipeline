const dbbClient = require("./ddbClient");
const { migrationCIDs } = require("../controller/libs/constants");

module.exports = async (id, data) => {
  try {
    const params = {
      TableName: migrationCIDs,
      Key: {
        "id": id,
      },
      UpdateExpression: 'set userDataUpdated = :u',
      ExpressionAttributeValues: {
        ':u': data,
      },
    };

    await dbbClient.update(params).promise();
    return "Update Successful";
  } catch (error) {
    return null;
  }
};
