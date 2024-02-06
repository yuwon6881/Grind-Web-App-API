import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { ExercisesAndSets } from "../types/routineExercisesAndSets.type";

export const getWorkoutExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workout_exercises = await prisma.workout.findMany({
      where: {
        id: req.params.id,
      },

      include: {
        Workout_Exercise: {
          include: {
            Exercise: true,
          },
        },
        Workout_Custom_Exercise: {
          include: {
            Custom_Exercise: true,
          },
        },
      },
    });

    const workout_set = await prisma.workout_Sets.findMany({
      where: {
        workout_id: req.params.id,
      },
    });
    const combined = workout_exercises.flatMap((workout) => [
      ...workout.Workout_Exercise.map((workout_exercise) => ({
        ...workout_exercise.Exercise,
        sets: workout_set?.filter((sets) => {
          return sets.exercise_id === workout_exercise.exercise_id;
        }),
      })),
      ...workout.Workout_Custom_Exercise.map((workout_custom_exercise) => ({
        ...workout_custom_exercise.Custom_Exercise,
        sets: workout_set?.filter((sets) => {
          return (
            sets.custom_exercise_id ===
            workout_custom_exercise.custom_exercise_id
          );
        }),
      })),
    ]);
    res.json({ data: combined });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Error getting workout exercises";
      next(error);
    }
  }
};

export const createWorkoutExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!workout) {
      const error = new Error("Workout not found");
      error.name = "inputError";
      throw error;
    }
    await prisma.$transaction(async (prisma) => {
      await prisma.workout_Exercise.deleteMany({
        where: {
          workout_id: req.params.id,
        },
      });
      await prisma.workout_Custom_Exercise.deleteMany({
        where: {
          workout_id: req.params.id,
        },
      });
      await prisma.workout_Sets.deleteMany({
        where: {
          workout_id: req.params.id,
        },
      });

      await Promise.all(
        req.body.exercises.map(async (exercise: ExercisesAndSets) => {
          const data = {
            workout_id: req.params.id,
            index: exercise.index,
            rest_timer: exercise.rest_timer,
            note: exercise.note,
          };

          if (exercise.exercise_id) {
            await prisma.workout_Exercise.create({
              data: { ...data, exercise_id: exercise.exercise_id },
            });
            await prisma.workout_Sets.createMany({
              data: exercise.sets.map((set) => ({
                ...set,
                workout_id: req.params.id,
                exercise_id: exercise.exercise_id,
              })),
            });
          } else {
            await prisma.workout_Custom_Exercise.create({
              data: {
                ...data,
                custom_exercise_id: exercise.custom_exercise_id,
              },
            });
            await prisma.workout_Sets.createMany({
              data: exercise.sets.map((set) => ({
                ...set,
                workout_id: req.params.id,
                custom_exercise_id: exercise.exercise_id,
              })),
            });
          }
        }),
      );
    });
    res.json({ data: "Success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Error adding exercise to workout";
      next(error);
    }
  }
};
