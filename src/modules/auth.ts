import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "../types/user.type";
import config from "../config";

//Compare passwords

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err: any) {
    err.message = "Failed to compare passwords";
    throw err;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (err: any) {
    err.message = "Failed to hash password";
    throw err;
  }
};

//Create JWT

export const createJWT = (user: User): string => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
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
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401);
    res.json({ message: "Unauthorized, no token provided" });
    return;
  }

  const [_, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "Unauthorized, invalid token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as Secret) as User;
    req.user = user;
    next();
  } catch (e) {
    res.status(401);
    res.json({ message: "Unauthorized, invalid token" });
    return;
  }
};
