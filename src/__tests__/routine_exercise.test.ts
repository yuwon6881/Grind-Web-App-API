import request, { Response } from "supertest";
import app from "../server";
import prisma from "../db";
import {
  Custom_Exercise,
  Exercise,
  Routine,
  Routine_Set,
  exerciseType,
} from "@prisma/client";
import { addRoutineExerciseAndCustomExerciseWithSets, user } from "./testData";

let token: string;
beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Routine Exercise Endpoints", () => {
  let routine: Routine,
    exercise: Exercise,
    custom_exercise: Custom_Exercise,
    routine_set: Routine_Set;
  beforeEach(async () => {
    const user = await prisma.user.findMany();
    const folder = await prisma.folder.findMany();
    await prisma.$transaction(
      async (
        prisma,
      ): Promise<[Routine, Exercise, Custom_Exercise, Routine_Set]> => {
        routine = await prisma.routine.create({
          data: {
            name: "test",
            folder_id: folder[0].id,
          },
        });
        exercise = await prisma.exercise.create({
          data: {
            name: "exercise1",
            image: null,
            exerciseType: exerciseType.MACHINE,
          },
        });
        custom_exercise = await prisma.custom_Exercise.create({
          data: {
            name: "custom_exercise1",
            image: null,
            exerciseType: exerciseType.BARBELL,
            user_id: user[0].id,
          },
        });

        routine_set = await prisma.routine_Set.create({
          data: {
            routine_id: routine.id,
            exercise_id: exercise.id,
            reps: 5,
            weight: 100,
            rpe: 9,
            index: 0,
            set_uuid: "uuid4",
          },
        });

        await prisma.routine_Exercise.create({
          data: {
            routine_id: routine.id,
            exercise_id: exercise.id,
            index: 0,
            rest_timer: 0,
            note: "note1",
          },
        });
        await prisma.routine_Custom_Exercise.create({
          data: {
            routine_id: routine.id,
            custom_exercise_id: custom_exercise.id,
            index: 0,
            rest_timer: 0,
            note: "note1",
          },
        });
        return [routine, exercise, custom_exercise, routine_set];
      },
    );
  });
  describe("GET /api/routines/:id/exercises", () => {
    describe("when request is valid", () => {
      it("should return a list of exercises from the routine", async () => {
        const response = await request(app)
          .get(`/api/routine/${routine.id}/exercises`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual([
          { ...exercise, sets: [routine_set] },
          { ...custom_exercise, sets: [] },
        ]);
      });
    });
    describe("when request is invalid", () => {
      it("should return an empty array", async () => {
        const response = await request(app)
          .get(`/api/routine/wrongID/exercises`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual([]);
      });
    });
  });
  describe("POST /api/routine/:routine_id/exercises", () => {
    beforeEach(async () => {
      await prisma.routine_Exercise.deleteMany();
      await prisma.routine_Custom_Exercise.deleteMany();
      await prisma.routine_Set.deleteMany();
    });
    describe("when request is valid", () => {
      it("should add exercises to the routine", async () => {
        const response = await request(app)
          .post(`/api/routine/${routine.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addRoutineExerciseAndCustomExerciseWithSets(
              exercise.id,
              custom_exercise.id,
            ),
          );
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ success: true });

        //check if exercises were added
        const routine_exercises = await prisma.routine_Exercise.findMany({
          where: {
            routine_id: routine.id,
          },
        });
        const routine_custom_exercises =
          await prisma.routine_Custom_Exercise.findMany({
            where: {
              routine_id: routine.id,
            },
          });
        const routine_set = await prisma.routine_Set.findMany({
          where: {
            routine_id: routine.id,
          },
        });
        expect(routine_exercises.length).toEqual(1);
        expect(routine_custom_exercises.length).toEqual(1);
        expect(routine_set.length).toEqual(3);
      });
    });
    describe("when request is invalid", () => {
      it("should return body exercises is required", async () => {
        const response = await request(app)
          .post(`/api/routine/${routine.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send({});
        expect(response.status).toEqual(400);
      });
      it("should return routine not found error", async () => {
        const response = await request(app)
          .post(`/api/routine/wrongID/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addRoutineExerciseAndCustomExerciseWithSets(
              exercise.id,
              custom_exercise.id,
            ),
          );
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual("Routine not found");
      });
      it("should return error adding exercise to routine", async () => {
        const response = await request(app)
          .post(`/api/routine/${routine.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addRoutineExerciseAndCustomExerciseWithSets("wrongID", "wrongID"),
          );
        expect(response.status).toEqual(500);
        //check if transaction was rolled back
        const routine_exercises = await prisma.routine_Exercise.findMany({
          where: {
            routine_id: routine.id,
          },
        });
        const routine_custom_exercises =
          await prisma.routine_Custom_Exercise.findMany({
            where: {
              routine_id: routine.id,
            },
          });
        const routine_set = await prisma.routine_Set.findMany({
          where: {
            routine_id: routine.id,
          },
        });

        expect(routine_exercises.length).toEqual(0);
        expect(routine_custom_exercises.length).toEqual(0);
        expect(routine_set.length).toEqual(0);
      });
    });
  });
});
