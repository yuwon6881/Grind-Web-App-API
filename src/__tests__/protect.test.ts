import app from "../server";
import { Response } from "supertest";
import request from "supertest";

describe("protect middleware", () => {
  describe("when no token is provided", () => {
    it("should return an error", async () => {
      const response: Response = await request(app).delete("/api/user");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized, no token provided");
    });
  });
  describe("when invalid token is provided", () => {
    it("should return an error", async () => {
      const response: Response = await request(app)
        .delete("/api/user")
        .set("Authorization", "Bearer invalidToken");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized, invalid token");
    });
  });
  it("should return an error", async () => {
    const response: Response = await request(app)
      .delete("/api/user")
      .set("Authorization", "Bearer invalidToken");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized, invalid token");
  });
});
