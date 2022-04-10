const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = async (apiKey) =>{
  const params = {
    TableName: userTable,
    FilterExpression: "apiKey = :K",
    ExpressionAttributeValues: {
      ":K": apiKey,
    },
  };

  return new Promise(function (resolve, reject) {
    dbbClient.scan(params, function (err, data) {
      if (err) {
        reject(false);
      } else {
        const { Items } = data;
        resolve(Items[0]);
      }
    });
  });
};
