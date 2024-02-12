import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import config from "../config";
import { User } from "@prisma/client";

//Compare passwords

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to compare passwords";
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to hash password";
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

//Create JWT
export const createJWT = (user: User): string => {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.secrets.jwt as Secret,
  );
  return token;
};

//Protect api routes

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let token = req.cookies["token"];

  if (!token) {
    const bearer = req.headers["authorization"];

    if (!bearer) {
      res.status(401);
      res.json({ message: "Unauthorized, no token provided" });
      return;
    }

    token = bearer.split(" ")[1];
    if (!token) {
      res.status(401);
      res.json({ message: "Unauthorized, invalid token" });
      return;
    }
  }

  try {
    const user = jwt.verify(token, config.secrets.jwt as Secret) as User;
    req.user = user;
    next();
  } catch (e) {
    res.status(401);
    res.json({ message: "Unauthorized, invalid token" });
    return;
  }
};

export const verifyJWT = (req: Request, res: Response): void => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error();
    }

    const response = jwt.verify(token, config.secrets.jwt as Secret) as User;
    res.status(200);
    res.json({ success: true, name: response.name });
  } catch (error) {
    res.clearCookie("token");
    res.json({ success: false });
    return;
  }
};
