import prisma from "../db";
import { Request, Response, NextFunction } from "express";

//Get all folders for a user
export const getFolders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
      },
      include: {
        Folder: true,
      },
    });

    res.json({ data: user });
  } catch (err: any) {
    err.message = "Failed to get folders";
    next(err);
  }
};

//Create a folder for a user
export const createFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const folder = await prisma.folder.create({
      data: {
        name: req.body.name,
        user_id: req.user!.id,
      },
    });

    res.json({ data: folder });
  } catch (err: any) {
    err.message = "Failed to create folder";
    next(err);
  }
};

//Delete a folder for a user
export const deleteFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deleted = await prisma.folder.delete({
      where: {
        id: req.params.id,
        user_id: req.user!.id,
      },
    });
    res.json({ data: deleted });
  } catch (err: any) {
    err.message = "Failed to delete folder";
    next(err);
  }
};
