import { Response } from "supertest";
import app from "../server";
import { exercise, muscle, user } from "./testData";
import request from "supertest";
import prisma from "../db";
import { Muscle, muscleType } from "@prisma/client";

let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;

  await prisma.exercise.create({
    data: exercise,
  });
});

describe("Exercise Endpoints", () => {
  describe("GET /api/exercises", () => {
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
  describe("GET /api/exercise/id", () => {
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
  describe("POST /api/exercise", () => {
    let createdMuscle: Muscle;
    beforeEach(async () => {
      createdMuscle = await prisma.muscle.create({
        data: muscle,
      });
    });
    describe("when request is valid", () => {
      it("should create an exercise", async () => {
        const response: Response = await request(app)
          .post("/api/exercise")
          .set("Authorization", `Bearer ${token}`)
          .send({
            ...exercise,
            muscles: JSON.stringify([
              { muscleID: createdMuscle.id, muscleType: muscleType.PRIMARY },
            ]),
          });

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(exercise);
      });
    });
    describe("when transaction fails", () => {
      it("should return muscle not found error", async () => {
        const response: Response = await request(app)
          .post("/api/exercise")
          .set("Authorization", `Bearer ${token}`)
          .send({
            ...exercise,
            muscles: JSON.stringify([
              { muscleID: "123", muscleType: muscleType.PRIMARY },
            ]),
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Muscle not found");
      });
    });
    describe("when name is missing from the body", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .post("/api/exercise")
          .set("Authorization", `Bearer ${token}`)
          .send({ exercise_type: "test" });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
      });
    });
    describe("when exercise type is missing from the body", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .post("/api/exercise")
          .set("Authorization", `Bearer ${token}`)
          .send({ name: "test" });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
      });
    });
  });
  describe("DELETE /api/exercise/id", () => {
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
