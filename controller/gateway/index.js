const dbbClient = require("../libs/ddbClient");
const { verify_signer, verify_api_key } = require("./verify");
const { gatewayTable } = require("../libs/constants");

const getTransactionDetails = require("./getTransactionDetails");
const updateSubDomain = require("./updateSubDomain");

exports.add_subdomain = async (req, res) => {
  try {
    let verified = false;
    const publicKey = req.body.publicKey.toLowerCase();
    if (req.body.signedMessage) {
      verified = await verify_signer(publicKey, req.body.signedMessage);
    } else {
      verified = await verify_api_key(req.body.apiKey);
    }

    if (verified) {
      const transactionDetails = await getTransactionDetails(publicKey);
      if (
        transactionDetails.txHash &&
        transactionDetails.publicKey.toLowerCase() === publicKey
      ) {
        transactionDetails.lastUpdate = Date.now();
        transactionDetails.subDomain = req.body.subDomain;
        const response = await updateSubDomain(transactionDetails);

        if (response) {
          res.status(200).json("SubDomain Created");
        } else {
          res.status(500).json("Internal server error");
        }
      } else {
        res.status(401).json("UnAuthorized");
      }
    } else {
      res.status(401).json("UnAuthorized");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Internal Server Error");
  }
};

exports.check_subdomain = async (req, res) => {
  try {
    const params = {
      TableName: gatewayTable,
      FilterExpression: "subDomain = :s",
      ExpressionAttributeValues: {
        ":s": req.query.subDomain,
      },
    };

    dbbClient.scan(params, function (err, data) {
      if (err) {
        res.status(500).send({
          message: "Internal Server Error",
        });
      } else {
        const { Items } = data;
        if (Items.length > 0) {
          res.status(200).send({
            message: "Exists",
          });
        } else {
          res.status(401).send({
            message: "UnAuthorized",
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.get_subdomain = async (req, res) => {
  try {
    const params = {
      TableName: gatewayTable,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": req.query.publicKey.toLowerCase(),
      },
    };

    dbbClient.scan(params, function (err, data) {
      if (err) {
        res.status(500).send({
          message: "Internal Server Error",
        });
      } else {
        const { Items } = data;
        if (Items.length > 0) {
          res.status(200).send({
            subDomain: Items[0]["subDomain"],
          });
        } else {
          res.status(200).send({
            subDomain: null,
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
