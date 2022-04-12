const AWS = require("aws-sdk");
const axios = require("axios");

const saveFileMetaData = require("./saveFileMetaData");

const tableName = "Users";

AWS.config.update({
  aws_table_name: tableName,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "ap-south-1",
});
const client = new AWS.DynamoDB.DocumentClient();

const user_data_details = async (publicKey) => {
  const params = {
    TableName: tableName,
    FilterExpression: "publicKey = :p",
    ExpressionAttributeValues: {
      ":p": publicKey,
    },
  };

  return new Promise(function (resolve, reject) {
    client.scan(params, function (err, data) {
      if (err) {
        reject(false);
      } else {
        const { Items } = data;
        resolve(Items[0]);
      }
    });
  });
};

const update_user_data = async (publicKey, record, fileSizeInBytes) => {
  const params = {
    TableName: tableName,
    Item: {
      publicKey: publicKey,
      message: record.message,
      dataLimit: record.dataLimit,
      dataUsed: parseInt(record.dataUsed) + parseInt(fileSizeInBytes),
    },
  };

  client.put(params, function (err, data) {
    if (err) {
      console.error(err);
      return "error";
    } else {
      console.log("PutItem succeeded:");
      return "updated";
    }
  });
};

const add_cid_estuary = async (name, cid) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.post(
      `https://api.estuary.tech/content/add-ipfs`,
      {
        name: name,
        root: cid,
      },
      { headers: headers }
    );

    return response.data;
  } catch (e) {
    return {
      message: "Internal Server Error",
    };
  }
};

exports.process_cid = async (req, res) => {
  try {
    const publicKey = req.body.publicKey.toLowerCase();
    const record = await user_data_details(publicKey);

    if (record) {
      if (req.body.size <= record.dataLimit - record.dataUsed) {
        // Create record of file
        await saveFileMetaData(
          publicKey,
          req.body.cid,
          req.body.name,
          req.body.size,
          "queued"
        );

        // Update data usage
        update_user_data(publicKey, record, req.body.size);

        // Send CID to Estuary
        const add_cid_response = await add_cid_estuary(
          req.body.name,
          req.body.cid
        );
        res.status(200).json(add_cid_response);
      } else {
        // Create record of file
        await saveFileMetaData(
          publicKey,
          req.body.cid,
          req.body.name,
          req.body.size,
          "payment pending"
        );
        res.status(500).json("Uploaded more than allowed limit");
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
