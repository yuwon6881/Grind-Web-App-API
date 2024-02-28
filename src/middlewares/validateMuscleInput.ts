import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateMuscleInput = [
  body("name").exists().isString().notEmpty(),
  handleInputErrors,
];
