import app from "../server";
const request = require("supertest");

describe("protect middleware", () => {
  describe("when no token is provided", () => {
    test("it should return an error", async () => {
      const response = await request(app).delete("/api/user");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized, no token provided");
    });
  });
  describe("when invalid token is provided", () => {
    test("it should return an error", async () => {
      const response = await request(app)
        .delete("/api/user")
        .set("Authorization", "Bearer invalidToken");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized, invalid token");
    });
  });
});
