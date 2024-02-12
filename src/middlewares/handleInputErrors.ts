import { NextFunction } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { Request, Response } from "express";

type validationResultType = ValidationError & {
  path?: string;
};

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors: Result<validationResultType> = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json({
      success: false,
      errors: errors.array(),
      message: errors.array()[0].msg + " for " + errors.array()[0].path,
    });
    return;
  }
  next();
};
