const app = require("../../app");
const ethers = require("ethers");
const supertest = require("supertest");

// get_ticker
test("Polygon Ticker: GET /get_ticker", async () => {
  await supertest(app)
    .get("/api/lighthouse/get_ticker?symbol=matic")
    .expect(200)
    .then((response) => {
      const ticker = JSON.parse(response.text);
      expect(typeof ticker).toBe("number");
    });
}, 30000);

test("Fantom Ticker: GET /get_ticker", async () => {
  await supertest(app)
    .get("/api/lighthouse/get_ticker?symbol=ftm")
    .expect(200)
    .then((response) => {
      const ticker = JSON.parse(response.text);
      expect(typeof ticker).toBe("number");
    });
}, 30000);

test("Binance Ticker: GET /get_ticker", async () => {
  await supertest(app)
    .get("/api/lighthouse/get_ticker?symbol=bnb")
    .expect(200)
    .then((response) => {
      const ticker = JSON.parse(response.text);
      expect(typeof ticker).toBe("number");
    });
}, 30000);

test("Ticker Catch Case: GET /get_ticker", async () => {
  await supertest(app).get("/api/lighthouse/get_ticker?symbol=et").expect(400);
}, 30000);

// status
test("Status: Get /cid_status", async () => {
  await supertest(app)
    .get(
      "/api/lighthouse/cid_status?cid=bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34"
    )
    .expect(200)
    .then((response) => {
      const status = JSON.parse(response.text);
      expect(typeof status[0]["content"]["cid"]).toBe("string");
      expect(typeof status[0]["content"]["name"]).toBe("string");
      expect(typeof status[0]["content"]["size"]).toBe("number");
    });
}, 30000);

test("Status Catch: Get /cid_status", async () => {
  await supertest(app)
    .get(
      "/api/lighthouse/cid_status?cid=bafkreia4ruswe7ghckleh3lmpujo5asrdd7hrtu5r23zjk2robpcoendd"
    )
    .expect(400);
}, 30000);

// add_cid
test("Add CID Main Case: GET /add_cid", async () => {
  const data = {
    "name": "adiyogi.jpg",
    "cid": "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34"
  };

  await supertest(app)
    .post("/api/lighthouse/add_cid")
    .send(data)
    .expect(200);
}, 30000);

test("Add CID Error Case: GET /add_cid", async () => {
  const data = {
    name: "adiyogi.jpg",
    cid: "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend"
  };

  await supertest(app)
    .post("/api/lighthouse/add_cid")
    .send(data)
    .expect(400);
}, 30000);

// add_cid_to_queue
test("Add CID To Queue: GET /add_cid_to_queue", async () => {
  const data = {
    name: "adiyogi.jpg",
    cid: "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34",
    publicKey: "0x487fc2fE07c593EAb555729c3DD6dF85020B5160",
    encryption: false,
    mimeType: "image/jpeg",
    size: "239214",
  };

  await supertest(app)
    .post("/api/lighthouse/add_cid_to_queue")
    .send(data)
    .expect(200);
}, 30000);

test("Add CID To Queue Record Not Found: GET /add_cid_to_queue", async () => {
  const data = {
    name: "adiyogi.jpg",
    cid: "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34",
    publicKey: "0x487fc2fE07c593EAb555729c3DD6dF85020B5179",
    encryption: false,
    mimeType: "image/jpeg",
    size: "239214",
  };

  await supertest(app)
    .post("/api/lighthouse/add_cid_to_queue")
    .send(data)
    .expect(404);
}, 30000);

test("Bulk CID Add: POST /bulk_cid_add", async () => {
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
        data: "[\"QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc\"]",
      };

      await supertest(app)
        .post("/api/lighthouse/bulk_cid_add")
        .send(data)
        .expect(200)
        .then((response) => {
          const res = JSON.parse(response.text);
          expect(typeof res).toBe("object");
        });
    });
}, 10000);

test("CID order status: GET /cid_order_status", async () => {

  await supertest(app)
    .get("/api/lighthouse/cid_order_status?publicKey=0xc88c729ef2c18baf1074ea0df537d61a54a8ce7b")
    .expect(200)
    .then((response) => {
      const order = JSON.parse(response.text);
      expect(typeof order).toBe("object");
    });
}, 30000);

test("Order Details: GET /order_details", async () => {

  await supertest(app)
    .get("/api/lighthouse/order_details?orderId=93e80a7f-f09c-491c-a0bd-40965cd37ebb")
    .expect(200)
    .then((response) => {
      const order = JSON.parse(response.text);
      expect(typeof order).toBe("object");
    });
}, 30000);

test("File Info: GET /file_info", async () => {

  await supertest(app)
    .get("/api/lighthouse/file_info?cid=QmWWkks3aHf1pyygat1o2QEGmZMagCJVCa388UxiSNbvEN")
    .expect(200)
    .then((response) => {
      const info = JSON.parse(response.text);
      expect(typeof info).toBe("object");
    });
}, 30000);
