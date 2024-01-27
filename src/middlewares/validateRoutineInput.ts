import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateRoutineInput = [
  body("name").exists().isString(),
  body("folder_id").exists().isUUID(),
  handleInputErrors,
];
