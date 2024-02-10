import { Request, Response } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
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
  res.json({ message: error.message });
};
