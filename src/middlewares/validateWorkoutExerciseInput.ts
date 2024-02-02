import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateWorkoutExerciseInput = [
  body("exercises").isArray(),
  handleInputErrors,
];
