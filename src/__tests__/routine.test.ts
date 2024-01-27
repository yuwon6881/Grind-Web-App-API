import app from "../server";
import { user } from "./testData";
import { Response } from "supertest";

import request from "supertest";
let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Routine Endpoints", () => {
  describe("GET /routines", () => {
    describe("when request is valid", () => {
      it("should return a list of routines", async () => {
        const response: Response = await request(app)
          .get("/api/routines")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
  });
});
