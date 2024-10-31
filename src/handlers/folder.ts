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
        Folder: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    res.json({ success: true, data: user!.Folder });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get folders";
      next(error);
    }
  }
};

//Get default folder for a user
export const getDefaultFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        user_id: req.user!.id,
        name: "SystemDefault",
        index: -1,
      },
    });

    res.json({ success: true, data: folder });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get default folder";
      next(error);
    }
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

    res.json({ success: true, data: folder });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to create folder";
      next(error);
    }
  }
};

//Delete a folder for a user
export const deleteFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const defaultFolder = await prisma.folder.findFirst({
      where: {
        user_id: req.user!.id,
        name: "SystemDefault",
        index: -1,
      },
    });

    const deleted = await prisma.folder.update({
      where: {
        id: req.params.id,
        user_id: req.user!.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    //Move all routines in the deleted folder to the default folder
    await prisma.routine.updateMany({
      where: {
        folder_id: req.params.id,
      },
      data: {
        folder_id: defaultFolder!.id,
      },
    });

    res.json({ success: true, data: deleted });
  } catch (error: unknown) {
    const customError = error as Error & { code?: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "notFound";
        customError.message = "Folder not found";
      } else {
        customError.message = "Failed to delete folder";
      }
      next(customError);
    }
  }
};

//Update folders for a user
export const updateFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const folderUpdates = req.body as { id: string; index: number }[];

    const updatePromises = folderUpdates.map((folder) =>
      prisma.folder.update({
        where: {
          id: folder.id,
          user_id: req.user!.id,
        },
        data: {
          index: folder.index,
        },
      }),
    );

    const updatedFolders = await prisma.$transaction(updatePromises);

    res.json({ success: true, data: updatedFolders });
  } catch (error: unknown) {
    const customError = error as Error & { code?: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "notFound";
        customError.message = "One or more folders not found";
      } else {
        customError.message = "Failed to update folders";
      }
      next(customError);
    }
  }
};
