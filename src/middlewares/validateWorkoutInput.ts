import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateWorkoutInput = [
  body("routine_id").exists().isUUID(),
  handleInputErrors,
];
