import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateUserRegisterInput = [
  body("name").exists().isString(),
  body("email").exists().isEmail(),
  body("password").exists().isString(),
  handleInputErrors,
];

export const validateUserSignInInput = [
  body("email").exists().isEmail(),
  body("password").exists().isString(),
  handleInputErrors,
];
