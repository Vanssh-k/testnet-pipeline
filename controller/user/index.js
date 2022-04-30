const userDetails = require("../authentication/userDetails");
const fileDetails = require("./fileDetails");
const getFileDataFromContract = require("./getFileDataFromContract");

const NotFoundError = require("../../errors/not-found-error");

exports.get_uploads = async (req, res, next) => {
  try {
    const metaData = await fileDetails(req.query.publicKey);
    for (let i = 0; i < metaData.length; i++) {
      metaData[i]["network"] = "polygon";
    }
    const metaDataOldFiles = await getFileDataFromContract(req.query.publicKey);

    res.status(200).send(metaData.concat(metaDataOldFiles));
  } catch (error) {
    next(error);
  }
};

exports.user_data_usage = async (req, res, next) => {
  try {
    const record = await userDetails(req.query.publicKey);
    if(!record){
      throw new NotFoundError();
    }

    res.status(200).json({
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};
