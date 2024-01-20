import app from "../server";
import { request } from "./setup";

//Test data
const user = {
  name: "test",
  email: "test5@test.com",
  password: "password",
};

describe("User Endpoints", () => {
  describe("POST /user", () => {
    describe("when request is valid", () => {
      test("it should return a token", async () => {
        const response = await request(app).post("/user").send(user);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
      });
    });
    describe("when email is already taken", () => {
      test("it should return an error", async () => {
        await request(app).post("/user").send(user);
        const response = await request(app).post("/user").send(user);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          message: "Email already exists",
        });
      });
    });
    describe("when no email is provided", () => {
      test("it should return an error", async () => {});
    });
    describe("when no password is provided", () => {
      test("it should return an error", async () => {});
    });
    describe("when no name is provided", () => {
      test("it should return an error", async () => {});
    });
  });
});
