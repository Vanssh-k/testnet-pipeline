const app = require("../../app");
const supertest = require("supertest");

// get_uploads
test("Get Uploads: GET /get_uploads", async () => {
  await supertest(app)
    .get(
      "/api/user/get_uploads?publicKey=0xC88C729Ef2c18baf1074EA0Df537d61a54A8CE7b"
    )
    .expect(200)
    .then((response) => {
      const uploads = JSON.parse(response.text);
      expect(typeof uploads[0].fileName).toBe("string");
      expect(typeof uploads[0].cid).toBe("string");
    });
}, 30000);

test("User Data Usage: GET /user_data_usage", async () => {
  await supertest(app)
    .get(
      "/api/user/user_data_usage?publicKey=0xC88C729Ef2c18baf1074EA0Df537d61a54A8CE7b"
    )
    .expect(200)
    .then((response) => {
      const usage = JSON.parse(response.text);
      expect(typeof usage.dataLimit).toBe("number");
      expect(typeof usage.dataUsed).toBe("number");
    });
}, 30000);
