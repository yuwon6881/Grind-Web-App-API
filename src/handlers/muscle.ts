import { Request, Response, NextFunction } from "express";
import prisma from "../db";
export const getMuscles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscles = await prisma.muscle.findMany();
    res.json({ success: true, data: muscles });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get muscles";
      next(error);
    }
  }
};

export const getMuscle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscle = await prisma.muscle.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!muscle) {
      const error = new Error();
      error.message = "Muscle not found";
      error.name = "inputError";
      throw error;
    }
    res.json({ success: true, data: muscle });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to get muscle";
      next(error);
    }
  }
};

export const createMuscle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscle = await prisma.custom_Muscle.create({
      data: {
        name: req.body.name,
        user_id: req.user?.id,
      },
    });
    res.json({ success: true, data: muscle });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to create muscle";
      next(error);
    }
  }
};

export const deleteMuscle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscle = await prisma.muscle.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
    });
    await prisma.muscle.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true, data: muscle });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const customError = error as Error & { code: string };
      if (customError.code === "P2025") {
        error.message = "Muscle not found";
        error.name = "inputError";
      }
      error.message = "Failed to delete muscle";
      next(error);
    }
  }
};
