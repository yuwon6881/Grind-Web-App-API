import { Request, Response, NextFunction } from "express";
import prisma from "../db";

// get routines with folder

export const getRoutines = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        user_id: req.user!.id,
      },
      include: {
        Routine: true,
      },
    });

    const routines = folders.flatMap((folder) => folder.Routine);
    res.json({ success: true, data: routines });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get routines";
      next(error);
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
    res.json({ success: true, data: routine });
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
