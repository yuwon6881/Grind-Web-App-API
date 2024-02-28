import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateExerciseInput = [
  body("name").exists().isString().notEmpty(),
  body("exerciseType").isIn([
    "BARBELL",
    "DUMBBELL",
    "MACHINE",
    "CABLE",
    "BODYWEIGHT",
    "DURATION",
  ]),
  body("muscles").isArray().notEmpty(),
  handleInputErrors,
];
