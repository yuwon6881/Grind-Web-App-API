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
