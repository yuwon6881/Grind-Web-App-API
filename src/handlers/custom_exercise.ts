import prisma from "../db";
import { Request, Response, NextFunction } from "express";

// get all custom exercises
export const getCustomExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const custom_Exercises = await prisma.custom_Exercise.findMany();
    res.json({ data: custom_Exercises });
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
    res.json({ data: custom_Exercise });
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
    const custom_Exercise = await prisma.custom_Exercise.create({
      data: {
        name: req.body.name,
        exerciseType: req.body.exerciseType,
        user_id: req.user!.id,
      },
    });
    res.json({ data: custom_Exercise });
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
    res.json({ data: custom_Exercise });
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
