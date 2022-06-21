const app = require("../../app");
const supertest = require("supertest");
const ethers = require("ethers");

test("Get Encryption Public Key: GET /get_encryption_publicKey", async () => {
  await supertest(app)
    .get(
      "/api/encryption/get_encryption_publicKey?publicKey=0xc88c729ef2c18baf1074ea0df537d61a54a8ce7b"
    )
    .expect(200)
    .then((response) => {
      const encryptionPublicKey = JSON.parse(response.text);
      expect(typeof encryptionPublicKey.encryptionPublicKey).toBe("string");
    });
}, 10000);

test("Get Encryption Public Key - Record Not Found: GET /get_encryption_publicKey", async () => {
  await supertest(app)
    .get(
      "/api/encryption/get_encryption_publicKey?publicKey=0xaaa4E24ffC1A2f53c07839a74966A6611b8Cb8A1"
    )
    .expect(404);
}, 10000);

test("Get Encryption Public Key - Key Not Found: GET /get_encryption_publicKey", async () => {
  await supertest(app)
    .get(
      "/api/encryption/get_encryption_publicKey?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1"
    )
    .expect(404);
}, 10000);

test("Save File Encryption Key - Auth Failed: POST /save_file_encryption_key", async () => {
  const postData = {
    cid: "QmW5F7WqyDzd6zmC1ex8ooyC7aYjnvcv2eGbZ43n19WgnJ",
    publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
    fileName: "test.jpg",
    nonce: "QwLx0+0cme3qUt3PRQCmsQBbnadC/14L",
    fileSizeInBytes: 82958,
    fileEncryptionKey: "YFpVJ0YMpi9y3DJdNqU/noTB7ktf9lFF9HIobDhp99vgCtgEGkgcHSS4h7KbvKLFEFGJsg==",
    sharedFrom: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8=",
    sharedTo: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8=",
    createdAt: 1655594266438,
    lastUpdate: 1655594266438
  };
  await supertest(app)
    .post(
      "/api/encryption/save_file_encryption_key"
    )
    .set("Authorization", "Bearer " + "blablabla")
    .send(postData)
    .expect(401)
}, 10000);

test("Save File Encryption Key: POST /save_file_encryption_key", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26"
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET4_PRIVATE_KEY,
        provider
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
        signedMessage: signedMessage,
      };

      await supertest(app)
        .post("/api/auth/verify_signer")
        .send(data)
        .expect(200)
        .then(async(response) => {
          const accessToken = JSON.parse(response.text);
          const postData = {
            cid: "QmW5F7WqyDzd6zmC1ex8ooyC7aYjnvcv2eGbZ43n19WgnJ",
            publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26  ",
            fileName: "test.jpg",
            nonce: "QwLx0+0cme3qUt3PRQCmsQBbnadC/14L",
            fileSizeInBytes: 82958,
            fileEncryptionKey: "YFpVJ0YMpi9y3DJdNqU/noTB7ktf9lFF9HIobDhp99vgCtgEGkgcHSS4h7KbvKLFEFGJsg==",
            sharedFrom: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8=",
            sharedTo: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8=",
            createdAt: 1655594266438,
            lastUpdate: 1655594266438
          };
          await supertest(app)
            .post(
              "/api/encryption/save_file_encryption_key"
            )
            .set("Authorization", "Bearer " + accessToken.accessToken)
            .send(postData)
            .expect(200)
        });
    });
}, 10000);

test("Get File Encryption Key - Auth Failed: POST /get_file_encryption_key", async () => {
  await supertest(app)
    .get(
      "/api/encryption/get_file_encryption_key?cid=QmW5F7WqyDzd6zmC1ex8ooyC7aYjnvcv2eGbZ43n19WgnJ&sharedTo=7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8="
    )
    .expect(200)
}, 10000);

test("Get File Encryption Key - Forbidden: POST /get_file_encryption_key", async () => {
  await supertest(app)
    .get(
      "/api/encryption/get_file_encryption_key?cid=QmW5F7WqyDzd6zmC1ex8ooyC7aYjnvcv2eGbZ43n19WgnJ&sharedTo=7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT5="
    )
    .expect(403)
}, 10000);

test("Get File Encryption Key - Main: POST /get_file_encryption_key", async () => {
  await supertest(app)
    .get(
      "/api/encryption/get_file_encryption_key?cid=QmW5F7WqyDzd6zmC1ex8ooyC7aYjnvcv2eGbZ43n19WgnJ&sharedTo=7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8="
    )
    .expect(200)
}, 10000);
