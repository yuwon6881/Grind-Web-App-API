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

// get a routine for folder
export const getRoutine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routinesQuery = await prisma.folder.findMany({
      where: { id: req.params.id },
      include: { Routine: true },
    });

    const routines = routinesQuery.flatMap((folder) => folder.Routine);
    res.json({ data: routines });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get routine";
      next(error);
    }
  }
};
