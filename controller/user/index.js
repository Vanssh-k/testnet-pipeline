const { getUploads, updateDataUsage } = require('./helper/userHelper');

exports.get_uploads = async (req, res, next) => {
  try {
    const fileList = await getUploads(req.query.publicKey.trim());
    res.status(200).send({
      data: fileList.Items,
      next: fileList.LastEvaluatedKey,
    });
  } catch (error) {
    next(error);
  }
};

exports.user_data_usage = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json({
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

exports.faucet_status = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json(record.faucet);
  } catch (error) {
    next(error);
  }
};

exports.update_data_usage = async (req, res, next) => {
  try {
    const update = await updateDataUsage(req.user, req.query.requestId, req.info.enterprise);
    res.status(200).json(update);
  } catch (error) {
    next(error);
  }
};
