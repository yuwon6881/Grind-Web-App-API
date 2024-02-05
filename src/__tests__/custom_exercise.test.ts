import { Response } from "supertest";
import app from "../server";
import { custom_exercise, user } from "./testData";
import request from "supertest";

let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;

  await request(app)
    .post("/api/custom_exercise")
    .set("Authorization", `Bearer ${token}`)
    .send(custom_exercise);
});

describe("Custom Exercise Endpoints", () => {
  describe("GET /api/custom_exercises", () => {
    describe("when request is valid", () => {
      it("should return a custom exercise", async () => {
        const response: Response = await request(app)
          .get("/api/custom_exercises")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(
          expect.arrayContaining([expect.objectContaining(custom_exercise)]),
        );
      });
    });
  });
  describe("GET /api/custom_exercise/id", () => {
    let customExerciseId: string;
    beforeEach(async () => {
      const response: Response = await request(app)
        .get("/api/custom_exercises")
        .set("Authorization", `Bearer ${token}`);

      customExerciseId = response.body.data[0].id;
    });
    describe("when request is valid", () => {
      it("should return a custom exercise", async () => {
        const response: Response = await request(app)
          .get(`/api/custom_exercise/${customExerciseId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(custom_exercise);
      });
    });
    describe("when custom exercise doesnt exists", () => {
      it("should return return custom exercise not found error", async () => {
        const response: Response = await request(app)
          .get(`/api/custom_exercise/${customExerciseId + 1}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Custom exercise not found");
      });
    });
  });
  describe("POST /api/custom_exercise", () => {
    describe("when request is valid", () => {
      it("should return a custom exercise", async () => {
        const response: Response = await request(app)
          .post("/api/custom_exercise")
          .set("Authorization", `Bearer ${token}`)
          .send(custom_exercise);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(custom_exercise);
      });
    });
    describe("when name is missing from the body", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .post("/api/custom_exercise")
          .set("Authorization", `Bearer ${token}`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
      });
    });
    describe("when exerciseType is missing from the body", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .post("/api/custom_exercise")
          .set("Authorization", `Bearer ${token}`)
          .send({ name: custom_exercise.name });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
      });
    });
  });
  describe("DELETE /api/custom_exercise/id", () => {
    let customExerciseId: string;
    beforeEach(async () => {
      const response: Response = await request(app)
        .get("/api/custom_exercises")
        .set("Authorization", `Bearer ${token}`);

      customExerciseId = response.body.data[0].id;
    });
    describe("when request is valid", () => {
      it("should delete a custom exercise", async () => {
        const response: Response = await request(app)
          .delete(`/api/custom_exercise/${customExerciseId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(custom_exercise);
      });
    });
    describe("when custom exercise doesnt exists", () => {
      it("should return return custom exercise not found error", async () => {
        const response: Response = await request(app)
          .delete(`/api/custom_exercise/${customExerciseId + 1}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Custom exercise not found");
      });
    });
  });
});
