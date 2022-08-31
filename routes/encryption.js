const express = require("express");
const EncryptionController = require("../controller/encryption");
const validate = require("../middlewares/validate");
const validator = require("../middlewares/validators");
const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.get(
  "/get_encryption_publicKey",
  validate(validator.publicKeySchema, { query: true }),
  authenticator(["verifypublickey"], ["useEncryptionPublicKeyExists"]),
  EncryptionController.get_encryption_publicKey
);

router.post(
  "/save_file_encryption_key",
  validate(validator.saveFileEncryptionKeySchema, { body: true }),
  authenticator(["verifyjwt"], ["useSHA256WithAccessTokenAndApiKey"]),
  EncryptionController.save_file_encryption_key
);

router.get(
  "/get_file_encryption_key",
  validate(validator.getFileEncryptionKeySchema, { query: true }),
  EncryptionController.get_file_encryption_key
);

router.get(
  "/get_encrypted_uploads",
  validate(validator.publicKeySchema, { query: true }),
  EncryptionController.get_encrypted_uploads
);

module.exports = router;
