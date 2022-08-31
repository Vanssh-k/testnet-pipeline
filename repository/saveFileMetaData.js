const dbbClient = require("./ddbClient");
const { fileTable } = require("../controller/libs/constants");

module.exports = async (record) => {
  try {
    const params = {
      TableName: fileTable,
      Item: record,
    };

    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error) {
    console.error(error);
    return null;
  }
};
