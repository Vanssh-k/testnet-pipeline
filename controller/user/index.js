const userDetails = require("../authentication/userDetails");
const fileDetails = require("./fileDetails");

const NotFoundError = require("../../errors/not-found-error");

exports.get_uploads = async (req, res, next) => {
  try {
    const files = await fileDetails(req.query.publicKey);
    for (let i = 0; i < files.length; i++) {
      files[i]["network"] = "polygon";
    }

    res.status(200).send(files);
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
