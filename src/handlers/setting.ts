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
        id: req.params.id,
      },
    });
    res.json({ data: setting });
  } catch (err: any) {
    err.message = "Failed to get user setting";
    next(err);
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
        id: req.params.id,
      },
      data: req.body,
    });
    res.json({ data: setting });
  } catch (err: any) {
    err.message = "Failed to update user setting";
    next(err);
  }
};
