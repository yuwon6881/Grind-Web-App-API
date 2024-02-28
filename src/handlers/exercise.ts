import { Exercise, muscleType } from "@prisma/client";
import prisma from "../db";
import { Request, Response, NextFunction } from "express";

// get all exercises
export const getExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: {
        Exercise_Muscle: {
          select: {
            muscleType: true,
            Muscle: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.json({ success: true, data: exercises });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get exercises";
      next(error);
    }
  }
};

// get one exercise
export const getExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!exercise) {
      const error = new Error();
      error.message = "Exercise not found";
      error.name = "inputError";
      throw error;
    }
    res.json({ success: true, data: exercise });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to get exercise";
      next(error);
    }
  }
};

// create an exercise
export const createExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercise: Exercise = await prisma.$transaction(
      async (prisma): Promise<Exercise> => {
        const transaction_exercise = await prisma.exercise.create({
          data: {
            name: req.body.name,
            exerciseType: req.body.exerciseType,
          },
        });

        const muscles: { muscleID: string; muscleType: muscleType }[] =
          req.body.muscles;

        const transaction_promises = muscles.map(async (muscle) => {
          const muscleExists = await prisma.muscle.findUnique({
            where: {
              id: muscle.muscleID,
            },
          });
          if (!muscleExists) {
            const error = new Error("Muscle not found");
            error.name = "inputError";
            throw error;
          }
          return prisma.exercise_Muscle.create({
            data: {
              Exercise: {
                connect: {
                  id: transaction_exercise.id,
                },
              },
              Muscle: {
                connect: {
                  id: muscle.muscleID,
                },
              },
              muscleType: muscle.muscleType,
            },
          });
        });

        await Promise.all(transaction_promises);

        return transaction_exercise;
      },
    );
    if (!exercise) {
      throw new Error();
    }
    res.json({ success: true, data: exercise });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to create exercise";
      next(error);
    }
  }
};

// delete an exercise
export const deleteExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deleted = await prisma.exercise.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true, data: deleted });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "inputError";
        customError.message = "Exercise not found";
      }
      customError.message = customError.message || "Failed to delete exercise";
      next(customError);
    }
  }
};
