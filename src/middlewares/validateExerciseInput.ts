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
  body("muscles.*.muscleID").isUUID(),
  body("muscles.*.muscleType").isIn(["PRIMARY", "SECONDARY"]),
  handleInputErrors,
];
