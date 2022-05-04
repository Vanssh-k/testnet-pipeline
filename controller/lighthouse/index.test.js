const app = require("../../app");
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
    size: 239214,
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
    size: 239214,
  };

  await supertest(app)
    .post("/api/lighthouse/add_cid_to_queue")
    .send(data)
    .expect(404);
}, 30000);
