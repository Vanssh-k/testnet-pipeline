const dbbClient = require("../libs/ddbClient");
const { fileTable } = require("../libs/constants");

module.exports = async(usersPublicKey) =>{
  const params = {
    TableName: fileTable,
    FilterExpression: "publicKey = :p",
    ExpressionAttributeValues: {
      ":p": usersPublicKey.trim().toLowerCase(),
    },
  };

  return new Promise(function (resolve, reject) {
    dbbClient.scan(params, function (err, data) {
      try{
        if (err) {
          reject(err);
        }
        const { Items } = data;
        resolve(Items);
      } catch (error){
        console.error(error);
        reject(null);
      }
    });
  })
};
