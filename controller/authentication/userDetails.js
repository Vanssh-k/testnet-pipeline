const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = async(usersPublicKey) =>{
  try{
    const params = {
      TableName: userTable,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": usersPublicKey.trim().toLowerCase(),
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return(Items[0]);
  } catch (error){
    return(null);
  }
}
