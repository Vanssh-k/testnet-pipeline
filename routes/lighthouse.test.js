const app = require("../app");
const supertest = require("supertest");

test("Polygon Chain: POST /get_quote", async () => {
  const data = {
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    ipfs_hash: "QmQXyQZQQ7QZ7Q7QZ7QZ7QZ7QZ7QZ7QZ7QZ7QZ7QZ7QZ7",
    fileSize: "1144000",
    chain: "polygon",
    network: "testnet",
  };

  await supertest(app)
    .post("/api/lighthouse/get_quote")
    .send(data)
    .expect(200)
    .then((response) => {
      const quote = JSON.parse(response.text);
      expect(quote).toHaveProperty("cost");
      expect(typeof quote.cost).toBe("number");

      expect(quote).toHaveProperty("current_balance");
      expect(typeof quote.current_balance).toBe("number");

      expect(quote).toHaveProperty("gasFee");
      expect(typeof quote.gasFee).toBe("number");
    });
}, 30000);

test("Fantom Chain: POST /get_quote", async () => {
  const data = {
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    ipfs_hash: "QmQXyQZQQ7QZ7Q7QZ7QZ7QZ7QZ7QZ7QZ7QZ7QZ7QZ7QZ7",
    fileSize: "1144000",
    chain: "fantom",
    network: "testnet",
  };

  await supertest(app)
    .post("/api/lighthouse/get_quote")
    .send(data)
    .expect(200)
    .then((response) => {
      const quote = JSON.parse(response.text);
      expect(quote).toHaveProperty("cost");
      expect(typeof quote.cost).toBe("number");

      expect(quote).toHaveProperty("current_balance");
      expect(typeof quote.current_balance).toBe("number");

      expect(quote).toHaveProperty("gasFee");
      expect(typeof quote.gasFee).toBe("number");
    });
}, 30000);

test("Binance Chain: POST /get_quote", async () => {
  const data = {
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    ipfs_hash: "bafkreifibfqymtttqefhzbnhgripifo2ay52mknvtzfjgs72nunvvy5zc4",
    fileSize: "1144000",
    chain: "binance",
    network: "testnet",
  };

  await supertest(app)
    .post("/api/lighthouse/get_quote")
    .send(data)
    .expect(200)
    .then((response) => {
      const quote = JSON.parse(response.text);
      expect(quote).toHaveProperty("cost");
      expect(typeof quote.cost).toBe("number");

      expect(quote).toHaveProperty("current_balance");
      expect(typeof quote.current_balance).toBe("number");

      expect(quote).toHaveProperty("gasFee");
      expect(typeof quote.gasFee).toBe("number");
    });
}, 30000);
