import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateFolderRoutineInput = [
  body("name").exists().isString().notEmpty(),
  handleInputErrors,
];

export const validateFolderRoutineUpdateInput = [
  body("folder_id").optional().isString(),
  body("index").optional().isInt(),
];
