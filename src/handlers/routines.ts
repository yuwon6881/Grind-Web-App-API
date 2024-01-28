import { Request, Response, NextFunction } from "express";
import prisma from "../db";

// get all routines for a user
export const getRoutines = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const folders_routines = await prisma.folder.findMany({
      where: {
        user_id: req.user!.id,
      },
      include: {
        Routine: true,
      },
    });
    const routines = folders_routines.flatMap((folder) => folder.Routine);
    res.json({ data: routines });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get routines";
      next(error);
    }
  }
};

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
        folder_id: req.body.folder_id,
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

// delete a routine
export const deleteRoutine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine = await prisma.routine.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ data: routine });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.message = "Routine doesnt exist";
        customError.name = "inputError";
      } else {
        customError.message = "Failed to delete routine";
      }
      next(customError);
    }
  }
};
