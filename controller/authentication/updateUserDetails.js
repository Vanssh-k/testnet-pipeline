const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = async(updatedDetails) =>{
  updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase();
  const params = {
    TableName: userTable,
    Item: updatedDetails,
  };

  return new Promise(function (resolve, reject) {
    dbbClient.put(params, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve("Update Successful");
    });
  })
};
