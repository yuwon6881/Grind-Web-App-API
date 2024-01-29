import { Request, Response, NextFunction } from "express";
import prisma from "../db";
export const getRoutineExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine_exerciseQuery = await prisma.routine.findMany({
      where: {
        id: req.params.id,
      },

      include: {
        Routine_Exercise: {
          include: {
            Exercise: true,
          },
        },
        Routine_Custom_Exercise: {
          include: {
            Custom_Exercise: true,
          },
        },
      },
    });
    const routine_exercises = routine_exerciseQuery.flatMap((routine) => [
      ...routine.Routine_Exercise.map(
        (routine_exercise) => routine_exercise.Exercise,
      ),
      ...routine.Routine_Custom_Exercise.map(
        (routine_custom_exercise) => routine_custom_exercise.Custom_Exercise,
      ),
    ]);
    res.json({ data: routine_exercises });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Error getting routine exercises";
      next(error);
    }
  }
};
