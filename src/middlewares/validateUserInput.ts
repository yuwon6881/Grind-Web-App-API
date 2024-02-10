import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateUserRegisterInput = [
  body("name").exists().isString().notEmpty(),
  body("email").exists().isEmail().notEmpty(),
  body("password").exists().isString().notEmpty(),
  handleInputErrors,
];

export const validateUserSignInInput = [
  body("email").exists().isEmail().notEmpty(),
  body("password").exists().isString().notEmpty(),
  handleInputErrors,
];
