import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateUserRegisterInput = [
  body("name").exists().isString().notEmpty(),
  body("email").exists().isEmail().notEmpty(),
  body("password").exists().isString().notEmpty().isLength({ min: 8 }),
  body("confirmPassword").exists().isString().notEmpty(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  handleInputErrors,
];

export const validateUserSignInInput = [
  body("email").exists().isEmail().notEmpty(),
  body("password").exists().isString().notEmpty(),
  handleInputErrors,
];
