const dbbClient = require("../libs/ddbClient");
const { gatewayTable } = require("../libs/constants");

module.exports = async (usersPublicKey) => {
  const params = {
    TableName: gatewayTable,
    FilterExpression: "publicKey = :p",
    ExpressionAttributeValues: {
      ":p": usersPublicKey,
    },
  };

  return new Promise(function (resolve, reject) {
    dbbClient.scan(params, function (err, data) {
      try {
        if (err) {
          reject(err);
        }
        const { Items } = data;
        resolve(Items[0]);
      } catch (error) {
        console.error(error);
        reject(null);
      }
    });
  });
};
