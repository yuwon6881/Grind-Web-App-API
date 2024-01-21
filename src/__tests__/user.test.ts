import app from "../server";

const request = require("supertest");
//Test data
const user = {
  name: "test",
  email: "test@test.com",
  password: "password",
};

const signInUser = {
  ...user,
  name: undefined,
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
      test("it should return an error", async () => {
        const response = await request(app)
          .post("/user")
          .send({ ...user, email: null });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "Invalid value",
              path: "email",
              value: null,
            }),
          ]),
        );
      });
    });
    describe("when no password is provided", () => {
      test("it should return an error", async () => {
        const response = await request(app)
          .post("/user")
          .send({ ...user, password: null });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "Invalid value",
              path: "password",
              value: null,
            }),
          ]),
        );
      });
    });
    describe("when no name is provided", () => {
      test("it should return an error", async () => {
        const response = await request(app)
          .post("/user")
          .send({ ...user, name: null });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "Invalid value",
              path: "name",
              value: null,
            }),
          ]),
        );
      });
    });
  });
  describe("POST /signIn", () => {
    beforeEach(async () => {
      //create user
      await request(app).post("/user").send(user);
    });
    describe("when request is valid", () => {
      test("it should return a token", async () => {
        const response = await request(app).post("/signIn").send(signInUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
      });
    });
    describe("when user is not found", () => {
      test("it should return a no user found error", async () => {
        const response = await request(app)
          .post("/signIn")
          .send({ ...signInUser, email: "invalidEmail@test.com" });
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          message: "No user found",
        });
      });
    });
    describe("when password is invalid", () => {
      test("it should return an invalid password error", async () => {
        const response = await request(app)
          .post("/signIn")
          .send({ ...signInUser, password: "invalidPassword" });
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          message: "Invalid password",
        });
      });
    });
    describe("when no email is provided", () => {
      test("it should return an error", async () => {
        const response = await request(app)
          .post("/signIn")
          .send({ ...signInUser, email: null });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "Invalid value",
              path: "email",
              value: null,
            }),
          ]),
        );
      });
    });
    describe("when no password is provided", () => {
      test("it should return an error", async () => {
        const response = await request(app)
          .post("/signIn")
          .send({ ...signInUser, password: null });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "Invalid value",
              path: "password",
              value: null,
            }),
          ]),
        );
      });
    });
  });
  describe("DELETE /user", () => {
    let token: string;
    beforeEach(async () => {
      //create user
      const response = await request(app).post("/user").send(user);
      token = response.body.token;
    });
    describe("when request is valid", () => {
      test("it should delete the user", async () => {
        const response = await request(app)
          .delete("/api/user")
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          data: {
            email: user.email,
            name: user.name,
          },
        });
      });
    });
  });
});
