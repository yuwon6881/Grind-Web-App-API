import request, { Response } from "supertest";
import app from "../server";
import prisma from "../db";
import {
  Custom_Exercise,
  Exercise,
  Routine,
  Workout,
  Workout_Sets,
  exerciseType,
} from "@prisma/client";
import { addWorkoutExerciseAndCustomExerciseWithSets, user } from "./testData";

let token: string;
beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Workout Exercise Endpoints", () => {
  let routine: Routine,
    exercise: Exercise,
    custom_exercise: Custom_Exercise,
    workout: Workout,
    workout_set: Workout_Sets;
  beforeEach(async () => {
    const user = await prisma.user.findMany();
    const folder = await prisma.folder.findMany();
    await prisma.$transaction(
      async (
        prisma,
      ): Promise<
        [Routine, Exercise, Custom_Exercise, Workout, Workout_Sets]
      > => {
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

        workout = await prisma.workout.create({
          data: {
            routine_id: routine.id,
          },
        });

        workout_set = await prisma.workout_Sets.create({
          data: {
            workout_id: workout.id,
            exercise_id: exercise.id,
            reps: 10,
            weight: 100,
            set_uuid: "uuid1",
          },
        });
        await prisma.workout_Exercise.create({
          data: {
            workout_id: workout.id,
            exercise_id: exercise.id,
            index: 0,
            rest_timer: 0,
            note: "note1",
            workout_uuid: "uuid1",
          },
        });
        await prisma.workout_Custom_Exercise.create({
          data: {
            workout_id: workout.id,
            custom_exercise_id: custom_exercise.id,
            index: 0,
            rest_timer: 0,
            note: "note1",
            workout_uuid: "uuid2",
          },
        });

        return [routine, exercise, custom_exercise, workout, workout_set];
      },
    );
  });
  describe("GET /api/workouts/:id/exercises", () => {
    describe("when request is valid", () => {
      it("should return a list of exercises from the workout", async () => {
        const response = await request(app)
          .get(`/api/workout/${workout.id}/exercises`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual([
          { ...exercise, sets: [workout_set] },
          { ...custom_exercise, sets: [] },
        ]);
      });
    });
    describe("when request is invalid", () => {
      it("should return an empty array", async () => {
        const response = await request(app)
          .get(`/api/workout/wrongID/exercises`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual([]);
      });
    });
  });
  describe("POST /api/workout/:workout_id/exercises", () => {
    beforeEach(async () => {
      await prisma.workout_Exercise.deleteMany();
      await prisma.workout_Custom_Exercise.deleteMany();
      await prisma.workout_Sets.deleteMany();
    });
    describe("when request is valid", () => {
      it("should add exercises to the workout", async () => {
        const response = await request(app)
          .post(`/api/workout/${workout.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addWorkoutExerciseAndCustomExerciseWithSets(
              exercise.id,
              custom_exercise.id,
            ),
          );
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ success: true });

        //check if exercises were added
        const workout_exercises = await prisma.workout_Exercise.findMany({
          where: {
            workout_id: workout.id,
          },
        });
        const workout_custom_exercises =
          await prisma.workout_Custom_Exercise.findMany({
            where: {
              workout_id: workout.id,
            },
          });
        const workout_set = await prisma.workout_Sets.findMany({
          where: {
            workout_id: workout.id,
          },
        });
        expect(workout_exercises.length).toEqual(1);
        expect(workout_custom_exercises.length).toEqual(1);
        expect(workout_set.length).toEqual(3);
      });
    });
    describe("when request is invalid", () => {
      it("should return body exercises is required", async () => {
        const response = await request(app)
          .post(`/api/workout/${workout.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send({});
        expect(response.status).toEqual(400);
      });
      it("should return workout not found error", async () => {
        const response = await request(app)
          .post(`/api/workout/wrongID/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addWorkoutExerciseAndCustomExerciseWithSets(
              exercise.id,
              custom_exercise.id,
            ),
          );
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual("Workout not found");
      });
      it("should return error adding exercise to workout", async () => {
        const response = await request(app)
          .post(`/api/workout/${workout.id}/exercises`)
          .set("Authorization", `Bearer ${token}`)
          .send(
            addWorkoutExerciseAndCustomExerciseWithSets("wrongID", "wrongID"),
          );
        expect(response.status).toEqual(500);
        //check if transaction was rolled back
        const workout_exercises = await prisma.workout_Exercise.findMany({
          where: {
            workout_id: workout.id,
          },
        });
        const workout_custom_exercises =
          await prisma.workout_Custom_Exercise.findMany({
            where: {
              workout_id: workout.id,
            },
          });
        const workout_set = await prisma.workout_Sets.findMany({
          where: {
            workout_id: workout.id,
          },
        });

        expect(workout_exercises.length).toEqual(0);
        expect(workout_custom_exercises.length).toEqual(0);
        expect(workout_set.length).toEqual(0);
      });
    });
  });
});
