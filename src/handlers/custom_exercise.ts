import { Custom_Exercise, muscleType } from "@prisma/client";
import prisma from "../db";
import { Request, Response, NextFunction } from "express";

// get all custom exercises
export const getCustomExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const custom_Exercises = await prisma.custom_Exercise.findMany({
      include: {
        Custom_Exercise_Muscle: {
          select: {
            muscleType: true,
            Muscle: {
              select: {
                name: true,
              },
            },
          },
        },
        Custom_Muscle_Custom_Exercise: {
          select: {
            muscleType: true,
            muscle: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.json({ success: true, data: custom_Exercises });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get custom exercises";
      next(error);
    }
  }
};

// get one custom exercise
export const getCustomExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const custom_Exercise = await prisma.custom_Exercise.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!custom_Exercise) {
      const error = new Error();
      error.message = "Custom exercise not found";
      error.name = "inputError";
      throw error;
    }
    res.json({ success: true, data: custom_Exercise });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to get custom exercise";
      next(error);
    }
  }
};

// create a custom exercise
export const createCustomExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const custom_Exercise: Custom_Exercise = await prisma.$transaction(
      async (prisma): Promise<Custom_Exercise> => {
        const transaction_custom_Exercise = await prisma.custom_Exercise.create(
          {
            data: {
              name: req.body.name,
              exerciseType: req.body.exerciseType,
              user_id: req.user!.id,
              image: req.file ? req.file.buffer : null,
            },
          },
        );

        const muscles: { muscleID: string; muscleType: muscleType }[] =
          JSON.parse(req.body.muscles);

        const transaction_promises = muscles.map(async (muscle) => {
          const muscleExists = await prisma.muscle.findUnique({
            where: {
              id: muscle.muscleID,
            },
          });
          if (!muscleExists) {
            const customMuscleExists = await prisma.custom_Muscle.findUnique({
              where: {
                id: muscle.muscleID,
              },
            });
            if (!customMuscleExists) {
              const error = new Error("Muscle not found");
              error.name = "inputError";
              throw error;
            }
            return prisma.custom_Muscle_Custom_Exercise.create({
              data: {
                exercise: {
                  connect: {
                    id: transaction_custom_Exercise.id,
                  },
                },
                muscle: {
                  connect: {
                    id: muscle.muscleID,
                  },
                },
                muscleType: muscle.muscleType,
              },
            });
          }
          return prisma.custom_Exercise_Muscle.create({
            data: {
              Custom_Exercise: {
                connect: {
                  id: transaction_custom_Exercise.id,
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
        return transaction_custom_Exercise;
      },
    );
    if (!custom_Exercise) {
      const error = new Error();
      error.message = "Failed to create custom exercise";
      throw error;
    }
    res.json({ success: true, data: custom_Exercise });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to create custom exercise";
      next(error);
    }
  }
};

// delete a custom exercise
export const deleteCustomExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const custom_Exercise = await prisma.custom_Exercise.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true, data: custom_Exercise });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "inputError";
        customError.message = "Custom exercise not found";
      }
      customError.message =
        customError.message || "Failed to delete custom exercise";
      next(customError);
    }
  }
};
