import prisma from "../db";
import { NextFunction, Request, Response } from "express";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

//Create New User

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: await hashPassword(req.body.password),
        },
      });

      try {
        await prisma.settings.create({
          data: {
            user_id: user.id,
          },
        });
      } catch (err: any) {
        err.message = "Failed to create user settings";
        next(err);
      }

      const token = createJWT(user);
      res.json({ token });
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      err.message = "Email already exists";
      err.name = "inputError";
    } else {
      console.log(err);
      err.message = "Failed to create user";
    }
    next(err);
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
