import request, { Response } from "supertest";
import app from "../server";
import { user } from "./testData";
import prisma from "../db";
import { Folder, Routine, Workout } from "@prisma/client";

let token: string;
beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Workout Endpoints", () => {
  describe("GET /api/workouts", () => {
    describe("when request is valid", () => {
      it("should return workouts", async () => {
        const response = await request(app)
          .get("/api/workouts")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
  });
  describe("DELETE /api/workout/:id", () => {
    let workout: Workout;
    beforeEach(async () => {
      const folder: Folder[] = await prisma.folder.findMany();
      const routine: Routine = await prisma.routine.create({
        data: {
          name: "routine",
          folder_id: folder[0].id,
        },
      });
      workout = await prisma.workout.create({
        data: {
          routine_id: routine.id,
        },
      });
    });
    describe("when request is valid", () => {
      it("should delete workout", async () => {
        const response = await request(app)
          .delete(`/api/workout/${workout.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
    describe("when workout is not found", () => {
      it("should return workout not found error", async () => {
        const response = await request(app)
          .delete("/api/workout/1")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual(
          expect.objectContaining({
            message: "Workout not found",
          }),
        );
      });
    });
  });
});
