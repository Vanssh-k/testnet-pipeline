const userDetails = require("./userDetails");
const updateUserDetails = require("./updateUserDetails");
const saveFileMetaData = require("./saveFileMetaData");
const fileDetails = require("./fileDetails");
const verifyAccessToken = require("../authentication/verifyAccessToken");

const NotFoundError = require("../../errors/not-found-error");
const ForbiddenError = require("../../errors/forbidden");

exports.get_encryption_publicKey = async (req, res, next) => {
  try {
    const record = await userDetails(req.query.publicKey);
    if (!record) {
      throw new NotFoundError();
    }

    res.status(200).json({ encryptionPublicKey: record.encryptionPublicKey });
  } catch (error) {
    next(error);
  }
};

exports.save_encryption_publicKey = async (req, res, next) => {
  try {
    const usersPublicKey = req.body.publicKey;
    const encryptionPublicKey = req.body.encryptionPublicKey;
    const accessToken = req.headers["authorization"].split(" ")[1];

    const authentic = verifyAccessToken(usersPublicKey, accessToken);
    if (!authentic) {
      throw new ForbiddenError();
    }

    const updatedDetails = {
      publicKey: usersPublicKey,
      encryptionPublicKey: encryptionPublicKey,
    };

    const _ = await updateUserDetails(updatedDetails);

    res.status(200).json("Success");
  } catch (error) {
    next(error);
  }
};

exports.save_encryption_key = async (req, res, next) => {
  try {
    const record = {
      publicKey: req.body.publicKey,
      cid: req.body.cid,
      fileName: req.body.fileName,
      nonce: req.body.nonce,
      fileSizeInBytes: parseInt(req.body.fileSizeInBytes),
      fileEncryptionKey: req.body.fileEncryptionKey,
      sharedFrom: req.body.sharedFrom,
      sharedTo: req.body.sharedTo,
    };

    const _ = await saveFileMetaData(record);

    res.status(200).json("Success");
  } catch (error) {
    next(error);
  }
};

exports.get_file_encrypted_key = async (req, res, next) => {
  try {
    const cid = req.query.cid;
    const file = await fileDetails(cid);

    res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};
