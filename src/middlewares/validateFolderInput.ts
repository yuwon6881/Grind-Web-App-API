import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateFolderInput = [
  body("name").exists().isString(),
  handleInputErrors,
];
