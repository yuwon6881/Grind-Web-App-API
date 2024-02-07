import { Request, Response, NextFunction } from "express";
import prisma from "../db";

// create a routine for a folder
export const createRoutine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine = await prisma.routine.create({
      data: {
        name: req.body.name,
        folder_id: req.params.id,
      },
    });
    res.json({ data: routine });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.message = "Folder for routine doesnt exist";
        customError.name = "inputError";
      } else {
        customError.message = "Failed to create routine";
      }
      next(customError);
    }
  }
};
