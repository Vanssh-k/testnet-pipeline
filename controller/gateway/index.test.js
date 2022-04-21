const app = require("../../app");
const supertest = require("supertest");

test("Check Sub Domain Main Case: GET /check_subdomain", async () => {
  await supertest(app)
    .get("/api/gateway/check_subdomain?subDomain=ravish")
    .expect(200)
    .then((response) => {
      const exists = JSON.parse(response.text);
      expect(exists).toBe("Exists");
    });
}, 30000);

test("Check Sub Domain Not Found: GET /check_subdomain", async () => {
  await supertest(app)
    .get("/api/gateway/check_subdomain?subDomain=gateway")
    .expect(404);
}, 30000);

test("Get Sub Domain Main Case: GET /get_subdomain", async () => {
  await supertest(app)
    .get("/api/gateway/get_subdomain?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5160")
    .expect(200)
    .then((response) => {
      const subDomain = JSON.parse(response.text);
      expect(subDomain).toBe("ravish");
    });
}, 30000);

test("Get Sub Domain Not Found: GET /get_subdomain", async () => {
  await supertest(app)
    .get("/api/gateway/get_subdomain?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5161")
    .expect(400);
}, 30000);

test("Get Transaction Details Main Case: GET /get_transaction_details", async () => {
  await supertest(app)
    .get("/api/gateway/get_transaction_details?publicKey=0x487fc2fE07c593EAb555729c3DD6dF85020B5160")
    .expect(200)
    .then((response) => {
      const txDetails = JSON.parse(response.text);
      expect(typeof txDetails.network).toBe("string");
      expect(typeof txDetails.subDomain).toBe("string");
      expect(typeof txDetails.txHash).toBe("string");
      expect(typeof txDetails.value).toBe("number");
    });
}, 30000);
