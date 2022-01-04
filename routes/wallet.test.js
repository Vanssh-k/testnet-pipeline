const app = require("../app");
const supertest = require("supertest");

test("Polygon Chain: POST /get_balance", async () => {
  const data = {
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    chain: "polygon",
  };

  await supertest(app)
    .post("/api/wallet/get_balance")
    .send(data)
    .expect(200)
    .then((response) => {
      const balance = JSON.parse(response.text);
      expect(balance).toHaveProperty("data");
      expect(typeof balance.data).toBe("number");
    });
}, 15000);

test("Fantom Chain: POST /get_balance", async () => {
  const data = {
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    chain: "fantom",
  };

  await supertest(app)
    .post("/api/wallet/get_balance")
    .send(data)
    .expect(200)
    .then((response) => {
      const balance = JSON.parse(response.text);
      expect(balance).toHaveProperty("data");
      expect(typeof balance.data).toBe("number");
    });
}, 15000);

test("Binance Chain: POST /get_balance", async () => {
  const data = {
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    chain: "binance",
  };

  await supertest(app)
    .post("/api/wallet/get_balance")
    .send(data)
    .expect(200)
    .then((response) => {
      const balance = JSON.parse(response.text);
      expect(balance).toHaveProperty("data");
      expect(typeof balance.data).toBe("number");
    });
}, 15000);

// test("POST /create_wallet", async () => {

//   const data = {
//     password: "ravish",
//   };

//   await supertest(app).post("/api/wallet/create_wallet")
//     .send(data)
//     .expect(200)
//     .then((response) => {
//       const wallet = JSON.parse(response.text);
//       expect(wallet).toHaveProperty("privateKey");
//       expect(typeof wallet.privateKey).toBe("string");

//       expect(wallet).toHaveProperty("publicKey");
//       expect(typeof wallet.publicKey).toBe("string");

//       expect(wallet).toHaveProperty("privateKeyEncrypted");
//       expect(typeof wallet.privateKeyEncrypted).toBe("string");
//     });
// }, 15000);
