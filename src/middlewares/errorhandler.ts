import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err.name === "authError") {
    res.status(401);
  } else if (err.name === "inputError") {
    res.status(400);
  } else {
    res.status(500);
  }
  res.json({ message: err.message });
};
