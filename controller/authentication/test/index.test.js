const app = require("../../../app");
const supertest = require("supertest");
const ethers = require("ethers");

test("Message: GET /get_message", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1"
    )
    .expect(200)
    .then((response) => {
      const message = JSON.parse(response.text);
      expect(typeof message).toBe("string");
    });
}, 10000);

test("Verify Signer: POST /verify_signer", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1"
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET1_PRIVATE_KEY,
        provider
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
        signedMessage: signedMessage,
      };

      await supertest(app)
        .post("/api/auth/verify_signer")
        .send(data)
        .expect(200)
        .then((response) => {
          const accessToken = JSON.parse(response.text);
          expect(typeof accessToken.accessToken).toBe("string");
        });
    });
}, 10000);

test("Verify Signer Unauthorized Case: POST /verify_signer", async () => {
  const data = {
    publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
    signedMessage: "signedMessage",
  };

  await supertest(app).post("/api/auth/verify_signer").send(data).expect(401);
}, 10000);

test("Verify Access Token: GET /verify_access_token", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1"
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET1_PRIVATE_KEY,
        provider
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
        signedMessage: signedMessage,
      };

      await supertest(app)
        .post("/api/auth/verify_signer")
        .send(data)
        .expect(200)
        .then(async(response) => {
          const accessToken = JSON.parse(response.text);

          await supertest(app)
            .get("/api/auth/verify_access_token")
            .set("Authorization", "Bearer " + accessToken.accessToken)
            .expect(200)
            .then((response) => {
              const data = JSON.parse(response.text);
              expect(typeof data.publicKey).toBe("string");
            });
        });
    });
}, 10000);

test("Verify Signe Access Token Unauthorized Case: POST /verify_access_token", async () => {
  await supertest(app)
    .get("/api/auth/verify_access_token")
    .set("Authorization", "Bearer " + "blablabla")
    .expect(401);
}, 10000);

test("Api Key: POST /get_api_key", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1"
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET1_PRIVATE_KEY,
        provider
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
        signedMessage: signedMessage,
      };

      await supertest(app)
        .post("/api/auth/get_api_key")
        .send(data)
        .expect(200)
        .then((response) => {
          const apiKey = JSON.parse(response.text);
          expect(typeof apiKey).toBe("string");
        });
    });
}, 10000);

test("Api Key Record Not Found: POST /get_api_key", async () => {
  const data = {
    publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb1A0",
    signedMessage: "signedMessage",
  };

  await supertest(app).post("/api/auth/get_api_key").send(data).expect(404);
}, 10000);

test("Api Key Record Not Authorized: POST /get_api_key", async () => {
  const data = {
    publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
    signedMessage: "signedMessage",
  };

  await supertest(app).post("/api/auth/get_api_key").send(data).expect(401);
}, 10000);

// Test Wallet
test("Verify API Key: GET /verify_api_key", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1"
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET1_PRIVATE_KEY,
        provider
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
        signedMessage: signedMessage,
      };

      await supertest(app)
        .post("/api/auth/get_api_key")
        .send(data)
        .expect(200)
        .then(async (response) => {
          const apiKey = JSON.parse(response.text);
          await supertest(app)
            .get("/api/auth/verify_api_key")
            .set("Authorization", "Bearer " + apiKey)
            .expect(200)
            .then((response) => {
              const data = JSON.parse(response.text);
              expect(typeof data.publicKey).toBe("string");
            });
        });
    });
}, 10000);

test("Verify API Key Record Not Found: GET /verify_api_key", async () => {
  await supertest(app)
    .get("/api/auth/verify_api_key")
    .set("Authorization", "Bearer " + "937b68b8-3768-45d1-950b-30c3836785d5")
    .expect(404);
}, 10000);

test("Verify API Key Bad Request: GET /verify_api_key", async () => {
  await supertest(app).get("/api/auth/verify_api_key")
    .expect(400);
}, 10000);

test("Twitter, User Not Found: GET /tweet_recharge", async () => {
  await supertest(app)
    .get("/api/auth/tweet_recharge?publicKey=0x111B7C7114F7372207Ab0b36F1353B5d2D3b2a&twitterID=1536248943725535233")
    .set("Authorization", "Bearer " + "superman")
    .expect(404)
}, 10000);

test("Twitter, Auth Failed: GET /tweet_recharge", async () => {
  await supertest(app)
    .get("/api/auth/tweet_recharge?publicKey=0x43cb632F3dfC07F790ea93F9F9CF42f9A41400C2&twitterID=1536248943725535233")
    .set("Authorization", "Bearer " + "superman")
    .expect(401)
}, 10000);

test("Twitter, Invalid Tweet & Success: GET /tweet_recharge", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0x43cb632F3dfC07F790ea93F9F9CF42f9A41400C2"
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET5_PRIVATE_KEY,
        provider
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: "0x43cb632F3dfC07F790ea93F9F9CF42f9A41400C2",
        signedMessage: signedMessage,
      };

      await supertest(app)
        .post("/api/auth/verify_signer")
        .send(data)
        .expect(200)
        .then(async(response) => {
          const accessToken = JSON.parse(response.text);
          await supertest(app)
            .get(
              "/api/auth/tweet_recharge?publicKey=0x43cb632F3dfC07F790ea93F9F9CF42f9A41400C2&twitterID=1539242622581379072"
            )
            .set("Authorization", "Bearer " + accessToken.accessToken)
            .expect(200);
          
          await supertest(app)
            .get(
              "/api/auth/tweet_recharge?publicKey=0x43cb632F3dfC07F790ea93F9F9CF42f9A41400C2&twitterID=1539242622581379082"
            )
            .set("Authorization", "Bearer " + accessToken.accessToken)
            .expect(403);
        });
    });
}, 10000);

// Save Encryption public Key
test("Save Encryption public Key: POST /save_encryption_publicKey", async () => {
  await supertest(app)
    .get(
      "/api/auth/get_message?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5160"
    )
    .expect(200)
    .then(async (response) => {
      const verificationMessage = JSON.parse(response.text);
      const provider = new ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        process.env.TEST_WALLET2_PRIVATE_KEY,
        provider
      );
      const signedMessage = await signer.signMessage(verificationMessage);
      const data = {
        publicKey: "0x487fc2fE07c593EAb555729c3DD6dF85020B5160",
        signedMessage: signedMessage,
      };

      await supertest(app)
        .post("/api/auth/verify_signer")
        .send(data)
        .expect(200)
        .then(async(response) => {
          const accessToken = JSON.parse(response.text);
          const toSend = {
            publicKey: "0x487fc2fE07c593EAb555729c3DD6dF85020B5160",
            encryptionPublicKey: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8="
          };
          await supertest(app)
            .post("/api/auth/save_encryption_publicKey")
            .set("Authorization", "Bearer " + accessToken.accessToken)
            .send(toSend)
            .expect(200)
        });
    });
}, 10000);

test("Save Encryption public Key - Not Authentic: POST /save_encryption_publicKey", async () => {
  const toSend = {
    publicKey: "0x487fc2fE07c593EAb555729c3DD6dF85020B5160",
    encryptionPublicKey: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8="
  };

  await supertest(app)
    .post("/api/auth/save_encryption_publicKey")
    .set("Authorization", "Bearer " + "naruto")
    .send(toSend)
    .expect(401);
}, 10000);
