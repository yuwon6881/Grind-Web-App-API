import { Request, Response, NextFunction } from "express";
import prisma from "../db";

export const getWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workoutQuery = await prisma.folder.findMany({
      where: {
        user_id: req.user!.id,
      },
      include: {
        Routine: {
          include: {
            Workout: true,
          },
        },
      },
    });
    const workouts = workoutQuery.flatMap((folder) =>
      folder.Routine.flatMap((routine) => routine.Workout),
    );
    res.json({ data: workouts });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Error retrieving workouts";
      next(error);
    }
  }
};

export const deleteWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workout = await prisma.workout.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ data: workout });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.message = "Workout not found";
        customError.name = "inputError";
      } else {
        customError.message = "Error deleting workout";
      }
      next(customError);
    }
  }
};
