import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  if (error.name === "authError") {
    res.status(401);
  } else if (error.name === "inputError") {
    res.status(400);
  } else if (error.name === "notFound") {
    res.status(404);
  } else {
    res.status(500);
  }
  res.json({ success: false, message: error.message });
};
