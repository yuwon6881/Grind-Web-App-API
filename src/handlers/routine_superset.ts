import prisma from "../db";
import { Request, Response, NextFunction } from "express";
import { RoutineSuperset } from "../types/superset.type";

export const getRoutineSupersets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const routineSupersets = await prisma.routine_Superset.findMany();
    res.json(routineSupersets);
  } catch (error) {
    next(error);
  }
};

export const createRoutineSuperset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    routine_id,
    superset,
  }: { routine_id: string; superset: RoutineSuperset[] } = req.body;

  try {
    await prisma.$transaction(async (prisma) => {
      const Exercises = await Promise.all(
        superset
          .filter((exercise) => exercise.exercise_id)
          .map(async (exercise) => {
            return await prisma.routine_Exercise.findUnique({
              where: {
                routine_id: exercise.routine_id,
                exercise_id: exercise.exercise_id,
                routine_uuid: exercise.routine_uuid,
              },
            });
          }),
      );

      const Custom_Exercises = await Promise.all(
        superset
          .filter((exercise) => exercise.custom_exercise_id) // Filter out exercises without custom_exercise_id
          .map(async (exercise) => {
            return await prisma.routine_Custom_Exercise.findUnique({
              where: {
                routine_id: exercise.routine_id,
                custom_exercise_id: exercise.custom_exercise_id,
                routine_uuid: exercise.routine_uuid,
              },
            });
          }),
      );

      const routineSuperset = await prisma.routine_Superset.create({
        data: {
          routine_id: routine_id,
        },
      });

      await Promise.all([
        ...Exercises.map(async (exercise) => {
          await prisma.routineSuperset_Exercise.create({
            data: {
              routine_uuid: exercise!.routine_uuid,
              supersets_id: routineSuperset.id,
            },
          });
        }),
        ...Custom_Exercises.map(async (exercise) => {
          await prisma.routineSuperset_CustomExercise.create({
            data: {
              routine_uuid: exercise!.routine_uuid,
              supersets_id: routineSuperset.id,
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
