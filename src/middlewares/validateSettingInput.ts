import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateSettingInput = [
  body("theme").optional().isIn(["LIGHT", "DARK"]),
  body("weightUnit").optional().isIn(["KG", "LB"]),
  body("rpe").optional().isBoolean(),
  body("previousWorkoutValue").optional().isIn(["Default", "Template"]),
  handleInputErrors,
];
