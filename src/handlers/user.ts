import prisma from "../db";
import { NextFunction, Request, Response } from "express";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { Folder, Settings, User } from "@prisma/client";
import { fromBuffer } from "file-type";

//Create New User

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [user, setting, folder]: [User, Settings, Folder] =
      await prisma.$transaction(
        async (prisma): Promise<[User, Settings, Folder]> => {
          const newUser: User = await prisma.user.create({
            data: {
              name: req.body.name,
              email: req.body.email,
              password: await hashPassword(req.body.password),
            },
          });

          const newSetting: Settings = await prisma.settings.create({
            data: {
              user_id: newUser.id,
            },
          });

          const defaultFolder: Folder = await prisma.folder.create({
            data: {
              name: "SystemDefault",
              user_id: newUser.id,
              index: -1,
            },
          });

          return [newUser, newSetting, defaultFolder];
        },
      );
    if (user && setting && folder) {
      const token = createJWT(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });
      res.json({ success: true, token: token });
    }
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2002") {
        customError.message = "Email already exists";
        customError.name = "inputError";
      } else {
        customError.message =
          customError.message || "Create user transaction failed";
      }

      next(customError);
    }
  }
};

//Sign in

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email as string,
      },
    });

    if (!user) {
      res.status(401);
      res.json({ success: false, message: "Invalid Email" });
      return;
    }

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ success: false, message: "Invalid password" });
      return;
    }

    const token = createJWT(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
    res.json({ success: true, token: token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to sign in";
      next(error);
    }
  }
};

//Delete User

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: req.user!.id,
      },
    });
    res.json({ success: true, data: user });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "notFound";
        customError.message = "User not found";
      } else {
        customError.message = "Failed to delete user";
      }
      next(customError);
    }
  }
};

//Sign out
export const userSignOut = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Sign out successful" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to sign out";
      next(error);
    }
  }
};

//Get User
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requestUser = req.user;
    if (!requestUser) {
      throw new Error();
    }
    const user = await prisma.user.findUnique({
      where: {
        id: requestUser.id,
      },
      select: {
        id: false,
        name: false,
        email: false,
        role: false,
        createdAt: false,
        profilePicture: true,
      },
    });

    if (!user) {
      throw new Error();
    }

    if (user.profilePicture) {
      const buffer = user.profilePicture;
      const type = await fromBuffer(buffer);

      if (type) {
        const imageBase64 = `data:${type.mime};base64,${buffer.toString(
          "base64",
        )}`;
        requestUser.profilePicture = imageBase64;
      }
    }

    res.json({ success: true, data: requestUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get user";
      next(error);
    }
  }
};

//Get Users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, data: users });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get users";
      next(error);
    }
  }
};

//Update User
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        name: req.body.name,
        profilePicture: req.file ? req.file.buffer : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        profilePicture: false,
      },
    });
    if (user) {
      const token = createJWT(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });
      res.json({ success: true, data: user });
    }
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "notFound";
        customError.message = "User not found";
      } else {
        customError.message = "Failed to update user";
      }
      next(customError);
    }
  }
};
