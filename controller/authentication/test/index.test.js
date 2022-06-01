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
          const verify = JSON.parse(response.text);
          expect(typeof verify).toBe("string");
        });
    });
}, 10000);

test("Verify Signer Unauthorized Case: POST /verify_signer", async () => {
  const data = {
    publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
    signedMessage: "signedMessage",
  };

  await supertest(app)
    .post("/api/auth/verify_signer")
    .send(data)
    .expect(401)
}, 10000);

test("Verify Signer with Data: POST /verify_signer_with_data", async () => {
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
        .post("/api/auth/verify_signer_with_data")
        .send(data)
        .expect(200)
        .then((response) => {
          const verify = JSON.parse(response.text);
          expect(typeof verify.dataLimit).toBe("number");
          expect(typeof verify.dataUsed).toBe("number");
        });
    });
}, 10000);

test("Verify Signer with Data Unauthorized Case: POST /verify_signer_with_data", async () => {
  const data = {
    publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
    signedMessage: "signedMessage",
  };

  await supertest(app)
    .post("/api/auth/verify_signer_with_data")
    .send(data)
    .expect(401)
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

  await supertest(app)
    .post("/api/auth/get_api_key")
    .send(data)
    .expect(404)
}, 10000);

test("Api Key Record Not Authorized: POST /get_api_key", async () => {
  const data = {
    publicKey: "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1",
    signedMessage: "signedMessage",
  };

  await supertest(app)
    .post("/api/auth/get_api_key")
    .send(data)
    .expect(401)
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
        .then(async(response) => {
          const apiKey = JSON.parse(response.text);
          await supertest(app)
            .get("/api/auth/verify_api_key")
            .set('Authorization', 'Bearer ' + apiKey)
            .expect(200)
        });
    });
}, 10000);

test("Verify API Key Record Not Found: GET /verify_api_key", async () => {
  await supertest(app)
    .get("/api/auth/verify_api_key")
    .set('Authorization', 'Bearer ' + "937b68b8-3768-45d1-950b-30c3836785d5")
    .expect(404)
}, 10000);

test("Verify API Key Bad Request: GET /verify_api_key", async () => {
  await supertest(app)
    .get("/api/auth/verify_api_key")
    .expect(400)
}, 10000);

