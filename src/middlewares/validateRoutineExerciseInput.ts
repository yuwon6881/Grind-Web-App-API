import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateRoutineExerciseInput = [
  body("routine_id").exists().isUUID(),
  body("exercise_id").exists().isUUID(),
  body("rest_timer").optional().isNumeric(),
  body("notes").optional().isString(),
  handleInputErrors,
];
