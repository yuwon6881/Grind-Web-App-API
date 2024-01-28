import request, { Response } from "supertest";
import app from "../server";
import { user } from "./testData";
import prisma from "../db";
import { Folder, Routine } from "@prisma/client";

let token: string;
beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});
describe("RoutineWorkout Endpoints", () => {
  let routine: Routine;
  beforeEach(async () => {
    const folder: Folder[] = await prisma.folder.findMany();
    routine = await prisma.routine.create({
      data: {
        name: "Routine1",
        folder_id: folder[0].id,
      },
    });
  });
  describe("GET /routines/:id/workouts", () => {
    describe("when request is valid", () => {
      it("should return list of workouts for the routine", async () => {
        const response = await request(app)
          .get(`/api/routine/${routine.id}/workouts`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual([]);
      });
    });
  });
  describe("POST /routines/:id/workouts", () => {
    describe("when request is valid", () => {
      it("should create a workout for the routine", async () => {
        const response = await request(app)
          .post(`/api/routine/${routine.id}/workout`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty("data");
      });
    });
    describe("when routine id is invalid", () => {
      it("should return an error", async () => {
        const response = await request(app)
          .post(`/api/routine/invalid_id/workout`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(500);
        expect(response.body).toEqual(
          expect.objectContaining({
            message: "Failed to create workouts",
          }),
        );
      });
    });
  });
});
