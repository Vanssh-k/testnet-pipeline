const dbbClient = require("./ddbClient");
const { gatewayTable } = require("../controller/libs/constants");
const {
  subscriptionPurchaseTransactions,
  subscriptionPlans,
} = require("../controller/libs/constants");

const checkSubdomain = async (subDomain) => {
  try {
    const params = {
      TableName: gatewayTable,
      FilterExpression: "subDomain = :s",
      ExpressionAttributeValues: {
        ":s": subDomain,
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items[0];
  } catch (error) {
    return null;
  }
};

const getRecord = async (publicKey) => {
  try {
    const params = {
      TableName: gatewayTable,
      Key: {
        publicKey: publicKey.toLowerCase(),
      },
    };

    const record = await dbbClient.get(params).promise();
    return record.Item;
  } catch (error) {
    return null;
  }
};

const userTransactions = async (publicKey) => {
  try {
    const params = {
      TableName: subscriptionPurchaseTransactions,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": publicKey.toLowerCase(),
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items;
  } catch (error) {
    return null;
  }
};

const purchasedPlans = async (publicKey) => {
  try {
    // TODO: filter active plans
    const params = {
      TableName: subscriptionPlans,
      FilterExpression: "isActive = :a",
      ExpressionAttributeValues: {
        ":a": "true",
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items;
  } catch (error) {
    return null;
  }
};

module.exports = {
  checkSubdomain,
  getRecord,
  userTransactions,
  purchasedPlans,
};
