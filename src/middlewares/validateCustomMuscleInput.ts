import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateCustomMuscleInput = [
  body("name").exists().isString().notEmpty(),
  handleInputErrors,
];
