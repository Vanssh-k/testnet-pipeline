const userDetails = require("../authentication/userDetails");
const fileDetails = require("./fileDetails");
const getFileDataFromContract = require("./getFileDataFromContract");

exports.get_uploads = async (req, res) => {
  try {
    const metaData = await fileDetails(req.query.publicKey);
    for (let i = 0; i < metaData.length; i++) {
      metaData[i]["network"] = "polygon";
    }
    const metaDataOldFiles = await getFileDataFromContract(req.query.publicKey);

    res.status(200).send(metaData.concat(metaDataOldFiles));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.user_data_usage = async (req, res) => {
  try {
    const record = await userDetails(req.query.publicKey);

    if (record) {
      res.status(200).json({
        dataLimit: record.dataLimit,
        dataUsed: record.dataUsed,
      });
    } else {
      res.status(404).send("user does not exist");
    }
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};