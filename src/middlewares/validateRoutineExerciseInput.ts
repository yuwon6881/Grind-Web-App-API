import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateRoutineExerciseInput = [
  body("rest_timer").optional().isNumeric(),
  body("notes").optional().isString(),
  handleInputErrors,
];
