import prisma from "../db";
import { NextFunction, Request, Response } from "express";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { Settings, User } from "@prisma/client";

//Create New User

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [user, setting]: [User, Settings] = await prisma.$transaction(
      async (prisma): Promise<[User, Settings]> => {
        let newUser: User, newSetting: Settings;

        newUser = await prisma.user.create({
          data: {
            name: req.body.name,
            email: req.body.email,
            password: await hashPassword(req.body.password),
          },
        });

        newSetting = await prisma.settings.create({
          data: {
            user_id: newUser.id,
          },
        });

        return [newUser, newSetting];
      },
    );
    if (user && setting) {
      const token = createJWT(user);
      res.json({ token });
    }
  } catch (error: any) {
    if (error.code === "P2002") {
      error.message = "Email already exists";
      error.name = "inputError";
    } else {
      error.message = error.message || "Create user transaction failed";
    }

    next(error);
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
      res.json({ message: "No user found" });
      return;
    }

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "Invalid password" });
      return;
    }

    const token = createJWT(user);
    res.json({ token });
  } catch (err: any) {
    err.message = "Failed to sign in";
    next(err);
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
    res.json({ data: user });
  } catch (err: any) {
    err.message = "Failed to delete user";
    next(err);
  }
};
