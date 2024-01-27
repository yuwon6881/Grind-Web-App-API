import { Response } from "supertest";
import app from "../server";
import { exercise, user } from "./testData";
import request from "supertest";

let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;

  await request(app)
    .post("/api/exercise")
    .set("Authorization", `Bearer ${token}`)
    .send(exercise);
});

describe("Exercise Endpoints", () => {
  describe("GET /exercises", () => {
    describe("when request is valid", () => {
      it("should return an exercise", async () => {
        const response: Response = await request(app)
          .get("/api/exercises")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(
          expect.arrayContaining([expect.objectContaining(exercise)]),
        );
      });
    });
  });
  describe("GET /exercise/id", () => {
    let exerciseId: string;
    beforeEach(async () => {
      const response: Response = await request(app)
        .get("/api/exercises")
        .set("Authorization", `Bearer ${token}`);

      exerciseId = response.body.data[0].id;
    });
    describe("when request is valid", () => {
      it("should return an exercise", async () => {
        const response: Response = await request(app)
          .get(`/api/exercise/${exerciseId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(exercise);
      });
    });
    describe("when exercise doesnt exists", () => {
      it("should return return exercise not found error", async () => {
        const response: Response = await request(app)
          .get(`/api/exercise/${exerciseId + 1}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Exercise not found");
      });
    });
  });
  describe("POST /exercise", () => {
    describe("when request is valid", () => {
      it("should create an exercise", async () => {
        const response: Response = await request(app)
          .post("/api/exercise")
          .set("Authorization", `Bearer ${token}`)
          .send(exercise);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(exercise);
      });
    });
  });
  describe("DELETE /exercise/id", () => {
    let exerciseId: string;
    beforeEach(async () => {
      const response: Response = await request(app)
        .get("/api/exercises")
        .set("Authorization", `Bearer ${token}`);

      exerciseId = response.body.data[0].id;
    });
    describe("when request is valid", () => {
      it("should delete an exercise", async () => {
        const response: Response = await request(app)
          .delete(`/api/exercise/${exerciseId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(exercise);
      });
    });
    describe("when exercise doesnt exists", () => {
      it("should return return exercise not found error", async () => {
        const response: Response = await request(app)
          .delete(`/api/exercise/${exerciseId + 1}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Exercise not found");
      });
    });
  });
});
