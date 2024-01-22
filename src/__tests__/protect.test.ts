import app from "../server";

const request = require("supertest");
const user = {
  name: "test",
  email: "test@test.com",
  password: "password",
};

let token: string;

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
  describe("when wrong token is provided", () => {
    test("it should return an error", async () => {
      const response = await request(app)
        .delete("/api/user")
        .set("Authorization", `Bearer ${token + 1}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized, invalid token");
    });
  });
});
