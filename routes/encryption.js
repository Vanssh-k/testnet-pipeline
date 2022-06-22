const express = require("express");
const EncryptionController = require("../controller/encryption");
const { body, query } = require("express-validator");

const router = express.Router();
const validate = require("../middlewares/validate");

router.get(
  "/get_encryption_publicKey",
  [query("publicKey").not().isEmpty().withMessage("publicKey not found")],
  validate,
  EncryptionController.get_encryption_publicKey
);

router.post(
  "/save_file_encryption_key",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("fromPublicKey").trim().not().isEmpty().withMessage("fromPublicKey not found"),
    body("fileName").trim().not().isEmpty().withMessage("fileName not found"),
    body("cid").trim().not().isEmpty().withMessage("cid not found"),
    body("nonce").trim().not().isEmpty().withMessage("nonce not found"),
    body("fileSizeInBytes").trim().not().isEmpty().withMessage("fileSizeInBytes not found"),
    body("fileEncryptionKey").trim().not().isEmpty().withMessage("fileEncryptionKey not found"),
    body("sharedFrom").trim().not().isEmpty().withMessage("sharedFrom not found"),
    body("sharedTo").trim().not().isEmpty().withMessage("sharedTo not found"),
  ],
  validate,
  EncryptionController.save_file_encryption_key
);

router.get(
  "/get_file_encryption_key",
  [
    query("cid").not().isEmpty().withMessage("cid not found"),
    query("sharedTo").not().isEmpty().withMessage("sharedTo not found"),
  ],
  validate,
  EncryptionController.get_file_encryption_key
);

router.get(
  "/get_encrypted_uploads",
  [
    query("publicKey").not().isEmpty().withMessage("publicKey not found")
  ],
  validate,
  EncryptionController.get_encrypted_uploads
);

module.exports = router;
