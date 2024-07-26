import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateUpdateUserInput = [
  body("name").optional().isString(),
  handleInputErrors,
];
