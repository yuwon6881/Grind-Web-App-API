import { Request, Response, NextFunction } from "express";
import prisma from "../db";

//Get a user settings

export const getSetting = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const setting = await prisma.settings.findUnique({
      where: {
        user_id: req.user.id,
      },
    });
    if (!setting) {
      const error = new Error();
      error.message = "Setting not found";
      error.name = "inputError";
      throw error;
    }
    res.json({ success: true, data: setting });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to get user setting";
      next(error);
    }
  }
};

//Update a user settings

export const updateSetting = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const setting = await prisma.settings.update({
      where: {
        user_id: req.user.id,
      },
      data: req.body,
    });
    res.json({ success: true, data: setting });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "notFound";
        customError.message = "Setting not found";
      } else {
        customError.message = "Failed to update user setting";
      }
      next(customError);
    }
  }
};
