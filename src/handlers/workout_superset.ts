import prisma from "../db";
import { Request, Response, NextFunction } from "express";
import { WorkoutSuperset } from "../types/superset.type";

export const getWorkoutSupersets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workoutSupersets = await prisma.workout_Superset.findMany();
    res.json(workoutSupersets);
  } catch (error) {
    next(error);
  }
};

export const createWorkoutSuperset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    workout_id,
    superset,
  }: { workout_id: string; superset: WorkoutSuperset[] } = req.body;

  try {
    await prisma.$transaction(async (prisma) => {
      const Exercises = await Promise.all(
        superset
          .filter((exercise) => exercise.exercise_id)
          .map(async (exercise) => {
            return await prisma.workout_Exercise.findUnique({
              where: {
                workout_id: exercise.workout_id,
                exercise_id: exercise.exercise_id,
                workout_uuid: exercise.workout_uuid,
              },
            });
          }),
      );

      const Custom_Exercises = await Promise.all(
        superset
          .filter((exercise) => exercise.custom_exercise_id) // Filter out exercises without custom_exercise_id
          .map(async (exercise) => {
            return await prisma.workout_Custom_Exercise.findUnique({
              where: {
                workout_id: exercise.workout_id,
                custom_exercise_id: exercise.custom_exercise_id,
                workout_uuid: exercise.workout_uuid,
              },
            });
          }),
      );

      const workoutSuperset = await prisma.workout_Superset.create({
        data: {
          workout_id: workout_id,
        },
      });

      await Promise.all([
        ...Exercises.map(async (exercise) => {
          await prisma.workoutSuperset_Exercise.create({
            data: {
              workout_uuid: exercise!.workout_uuid,
              supersets_id: workoutSuperset.id,
            },
          });
        }),
        ...Custom_Exercises.map(async (exercise) => {
          await prisma.workoutSuperset_CustomExercise.create({
            data: {
              workout_uuid: exercise!.workout_uuid,
              supersets_id: workoutSuperset.id,
            },
          });
        }),
      ]);
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
