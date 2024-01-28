import { Request, Response, NextFunction } from "express";
import prisma from "../db";

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
