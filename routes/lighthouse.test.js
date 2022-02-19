const app = require("../app");
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

// user_token
test("User Token: POST /user_token", async () => {
  const data = {
    expiry_time: "1h",
  };

  await supertest(app)
    .post("/api/lighthouse/user_token")
    .send(data)
    .expect(200)
    .then((response) => {
      const user_token = JSON.parse(response.text);
      expect(user_token).toHaveProperty("token");
      expect(typeof user_token.token).toBe("string");
    });
}, 30000);

// status
test("Status: Get /status", async () => {
  await supertest(app)
    .get(
      "/api/lighthouse/status/bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34"
    )
    .expect(200)
    .then((response) => {
      const status = JSON.parse(response.text);
      expect(typeof status[0]["content"]["cid"]).toBe("string");
      expect(typeof status[0]["content"]["name"]).toBe("string");
      expect(typeof status[0]["content"]["size"]).toBe("number");
    });
}, 30000);

// get_uploads
test("Upload Client: GET /get_uploads", async () => {
  await supertest(app)
    .get(
      "/api/lighthouse/get_uploads?network=fantom&publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5160"
    )
    .expect(200)
    .then((response) => {
      const get_uploads = JSON.parse(response.text);
      expect(typeof get_uploads[0].cid).toBe("string");
    });
}, 30000);

// upload_client
test("Upload Client: GET /upload_client", async () => {
  await supertest(app)
    .get("/api/lighthouse/upload_client")
    .expect(200)
    .then((response) => {
      const upload_client = JSON.parse(response.text);
      expect(typeof upload_client).toBe("string");
    });
}, 30000);
