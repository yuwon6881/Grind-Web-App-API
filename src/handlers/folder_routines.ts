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
    res.json({ success: true, data: routine });
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

export const updateFolderRoutine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { folder_id, routine_id } = req.params;
    const updatedRoutine = await prisma.routine.update({
      where: { id: routine_id },
      data: { folder_id: folder_id },
    });
    res.json({ success: true, data: updatedRoutine });
  } catch (error: unknown) {
    const customError = error as Error;
    customError.message = "Failed to update folder routine";
    next(customError);
  }
};
