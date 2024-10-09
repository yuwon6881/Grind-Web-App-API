import { Request, Response, NextFunction } from "express";
import prisma from "../db";
export const getCustomMuscles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscles = await prisma.custom_Muscle.findMany({
      where: {
        user_id: req.user?.id,
      },
    });
    res.json({ success: true, data: muscles });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get custom muscles";
      next(error);
    }
  }
};

export const getCustomMuscle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscle = await prisma.custom_Muscle.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true, data: muscle });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get custom muscle";
      next(error);
    }
  }
};

export const createCustomMuscle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscle = await prisma.custom_Muscle.create({
      data: req.body,
    });
    res.json({ success: true, data: muscle });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to create custom muscle";
      next(error);
    }
  }
};

export const deleteCustomMuscle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const muscle = await prisma.custom_Muscle.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
    });
    await prisma.custom_Muscle.delete({
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
      error.message = "Failed to delete custom muscle";
      next(error);
    }
  }
};
