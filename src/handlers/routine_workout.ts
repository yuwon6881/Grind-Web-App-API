import { Request, Response, NextFunction } from "express";
import prisma from "../db";

export const getRoutineWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workoutQuery = await prisma.routine.findMany({
      where: {
        id: req.params.id,
      },
      include: {
        Workout: true,
      },
    });

    const workouts = workoutQuery.flatMap((routine) => routine.Workout);
    res.json({ success: true, data: workouts });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to retrieve workouts for routine";
      next(error);
    }
  }
};

export const createRoutineWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workout = await prisma.workout.create({
      data: {
        routine_id: req.params.id,
      },
    });

    res.json({ success: true, data: workout });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to create workouts";
      next(error);
    }
  }
};
