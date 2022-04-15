const dbbClient = require("../libs/ddbClient");
const { gatewayTable } = require("../libs/constants");

module.exports = async (transactionDetails) => {
  const params = {
    TableName: gatewayTable,
    Item: transactionDetails,
  };

  return new Promise(function (resolve, reject) {
    dbbClient.put(params, function (err, data) {
      if (err) {
        console.log(err);
        reject(false);
      } else {
        console.log("PutItem succeeded:");
        resolve(true);
      }
    });
  });
};
