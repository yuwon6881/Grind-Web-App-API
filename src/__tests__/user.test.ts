import app from "../server";
import { Response } from "supertest";
import { user, signInUser } from "./testData";

import request from "supertest";

describe("User Endpoints", () => {
  describe("POST /register", () => {
    describe("when request is valid", () => {
      it("should return a token", async () => {
        const response: Response = await request(app)
          .post("/register")
          .send(user);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
      });
    });
    describe("when email is already taken", () => {
      it("should return an error", async () => {
        await request(app).post("/register").send(user);
        const response: Response = await request(app)
          .post("/register")
          .send(user);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          message: "Email already exists",
        });
      });
    });
    describe("when no email is provided", () => {
      it("should return an error", async () => {
        const response: Response = await request(app)
          .post("/register")
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
      it("should return an error", async () => {
        const response: Response = await request(app)
          .post("/register")
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
      it("should return an error", async () => {
        const response: Response = await request(app)
          .post("/register")
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
      await request(app).post("/register").send(user);
    });
    describe("when request is valid", () => {
      it("should return a token", async () => {
        const response: Response = await request(app)
          .post("/signIn")
          .send(signInUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
      });
    });
    describe("when user is not found", () => {
      it("should return a invalid email error", async () => {
        const response: Response = await request(app)
          .post("/signIn")
          .send({ ...signInUser, email: "invalidEmail@test.com" });
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          message: "Invalid Email",
        });
      });
    });
    describe("when password is invalid", () => {
      it("should return an invalid password error", async () => {
        const response: Response = await request(app)
          .post("/signIn")
          .send({ ...signInUser, password: "invalidPassword" });
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          message: "Invalid password",
        });
      });
    });
    describe("when no email is provided", () => {
      it("should return an error", async () => {
        const response: Response = await request(app)
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
      it("should return an error", async () => {
        const response: Response = await request(app)
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
      const response: Response = await request(app)
        .post("/register")
        .send(user);
      token = response.body.token;
    });
    describe("when request is valid", () => {
      it("should delete the user", async () => {
        const response: Response = await request(app)
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
