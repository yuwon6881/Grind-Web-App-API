import request, { Response } from "supertest";
import app from "../server";
import prisma from "../db";
import {
  Custom_Exercise,
  Exercise,
  Folder,
  Routine,
  exerciseType,
} from "@prisma/client";
import { addRoutineExerciseAndCustomExerciseWithSets, user } from "./testData";

let token: string;
beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Routine Exercise Endpoints", () => {
  let routine: Routine, exercise: Exercise, custom_exercise: Custom_Exercise;
  beforeEach(async () => {
    const user = await prisma.user.findMany();
    const folder = await prisma.folder.findMany();
    await prisma.$transaction(
      async (prisma): Promise<[Routine, Exercise, Custom_Exercise]> => {
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
        return [routine, exercise, custom_exercise];
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
        expect(response.body.data).toEqual([exercise, custom_exercise]);
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
    let folder: Folder[],
      createdRoutine: Routine,
      createdExercise: Exercise,
      createdCustom_exercise: Custom_Exercise;
    beforeEach(async () => {
      const user = await prisma.user.findFirst();
      folder = await prisma.folder.findMany();
      createdRoutine = await prisma.routine.create({
        data: {
          name: "test",
          folder_id: folder[0].id,
        },
      });
      createdExercise = await prisma.exercise.create({
        data: {
          name: "exercise1",
          image: null,
          exerciseType: exerciseType.MACHINE,
        },
      });
      createdCustom_exercise = await prisma.custom_Exercise.create({
        data: {
          name: "custom_exercise1",
          image: null,
          exerciseType: exerciseType.BARBELL,
          user_id: user!.id,
        },
      });
    });
    describe("when request is valid", () => {
      it("should add exercises to the routine", async () => {
        const response = await request(app)
          .post(`/api/routine/${createdRoutine.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addRoutineExerciseAndCustomExerciseWithSets(
              createdExercise.id,
              createdCustom_exercise.id,
            ),
          );
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ data: "Success" });

        //check if exercises were added
        const routine_exercises = await prisma.routine_Exercise.findMany({
          where: {
            routine_id: createdRoutine.id,
          },
        });
        const routine_custom_exercises =
          await prisma.routine_Custom_Exercise.findMany({
            where: {
              routine_id: createdRoutine.id,
            },
          });
        const routine_set = await prisma.routine_Set.findMany({
          where: {
            routine_id: createdRoutine.id,
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
          .post(`/api/routine/${createdRoutine.id}/exercises`)
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
              createdExercise.id,
              createdCustom_exercise.id,
            ),
          );
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual("Routine not found");
      });
      it("should return error adding exercise to routine", async () => {
        const response = await request(app)
          .post(`/api/routine/${createdRoutine.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addRoutineExerciseAndCustomExerciseWithSets("wrongID", "wrongID"),
          );
        expect(response.status).toEqual(500);
        //check if transaction was rolled back
        const routine_exercises = await prisma.routine_Exercise.findMany({
          where: {
            routine_id: createdRoutine.id,
          },
        });
        const routine_custom_exercises =
          await prisma.routine_Custom_Exercise.findMany({
            where: {
              routine_id: createdRoutine.id,
            },
          });
        const routine_set = await prisma.routine_Set.findMany({
          where: {
            routine_id: createdRoutine.id,
          },
        });

        expect(routine_exercises.length).toEqual(0);
        expect(routine_custom_exercises.length).toEqual(0);
        expect(routine_set.length).toEqual(0);
      });
    });
  });
});
