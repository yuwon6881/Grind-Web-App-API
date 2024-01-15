import { body } from "express-validator";
import { handleInputErrors } from "./handleInputErrors";

export const validateExerciseInput = [
  body("name").exists().isString(),
  body("exerciseType").isIn([
    "BARBELL",
    "DUMBBELL",
    "MACHINE",
    "CABLE",
    "BODYWEIGHT",
    "DURATION",
  ]),
  handleInputErrors,
];
