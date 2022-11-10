const app = require("../../app");
const supertest = require("supertest");

// create_proposal
test("Add Proposal: POST /create_proposal", async () => {
  const data = {
    "publicKey": "0x487fc2fE07c593EAb555729c3DD6dF85020B5160",
    "proposal": "Test"
  };

  await supertest(app)
    .post("/api/governance/create_proposal")
    .send(data)
    .expect(200)
}, 30000);

// list_proposals
test("Get Proposals: GET /list_proposals", async () => {

  await supertest(app)
    .get("/api/governance/list_proposals")
    .expect(200)
    .then((response) => {
      const proposals = JSON.parse(response.text);
      expect(typeof proposals[0]).toBe("object");
    });
}, 30000);
