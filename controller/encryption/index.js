/* istanbul ignore file */
/* Not in use replaced with BLS key splitting */
const { v4: uuidv4 } = require("uuid");
const saveFileMetaData = require("../../repository/saveFileMetaData");
const fileDetails = require("../../repository/fileDetails");
const fileList = require("../../repository/fileList");
const ForbiddenError = require("../../errors/forbidden");

exports.get_encryption_publicKey = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json({ encryptionPublicKey: record.encryptionPublicKey });
  } catch (error) {
    next(error);
  }
};

exports.save_file_encryption_key = async (req, res, next) => {
  try {
    const timestamp = Date.now();
    const toSave = {
      id: uuidv4(),
      cid: req.body.cid,
      publicKey: req.body.publicKey.toLowerCase(),
      fileName: req.body.fileName,
      nonce: req.body.nonce,
      fileSizeInBytes: parseInt(req.body.fileSizeInBytes),
      fileEncryptionKey: req.body.fileEncryptionKey,
      sharedFrom: req.body.sharedFrom,
      sharedTo: req.body.sharedTo,
      createdAt: timestamp,
      lastUpdate: timestamp,
    };

    const _ = await saveFileMetaData(toSave);

    res.status(200).json("Success");
  } catch (error) {
    next(error);
  }
};

exports.get_file_encryption_key = async (req, res, next) => {
  try {
    const cid = req.query.cid;
    const sharedTo = req.query.sharedTo;
    const files = await fileDetails(cid);

    let record = null;
    for (let i = 0; i < files.length; i++) {
      if (files[i]["sharedTo"] === sharedTo) {
        record = files[i];
        break;
      }
    }

    if (!record) {
      throw new ForbiddenError();
    }

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

exports.get_encrypted_uploads = async (req, res, next) => {
  try {
    const publicKey = req.query.publicKey;
    const fileDetails = fileList(publicKey);

    res.status(200).json(fileDetails);
  } catch (error) {
    next(error);
  }
};
