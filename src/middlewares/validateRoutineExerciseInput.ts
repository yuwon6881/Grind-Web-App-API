import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateRoutineExerciseInput = [
  body("exercises").isArray(),
  handleInputErrors,
];
