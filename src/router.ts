import { Router } from "express";
import { createFolder, deleteFolder, getFolders } from "./handlers/folder";
import {
  createExercise,
  deleteExercise,
  getExercise,
  getExercises,
} from "./handlers/exercise";
import { validateExerciseInput } from "./middlewares/validateExerciseInput";
import { validateFolderInput } from "./middlewares/validateFolderInput";
import { validateSettingInput } from "./middlewares/validateSettingInput";
import { getSetting, updateSetting } from "./handlers/setting";
import { deleteUser } from "./handlers/user";
import { errorHandler } from "./middlewares/errorhandler";
import { validateRoutineInput } from "./middlewares/validateRoutineInput";
import { validateRoutineExerciseInput } from "./middlewares/validateRoutineExerciseInput";
import { validateWorkoutInput } from "./middlewares/validateWorkoutInput";
import { createRoutine, deleteRoutine, getRoutines } from "./handlers/routines";
import { deleteWorkout, getWorkouts } from "./handlers/workout";

const router = Router();

//user
router.delete("/user", deleteUser);

// settings
router.get("/setting/:id", getSetting);
router.put("/setting/:id", validateSettingInput, updateSetting);

// exercises
router.get("/exercises", getExercises);
router.get("/exercise/:id", getExercise);
router.post("/exercise", validateExerciseInput, createExercise);
router.delete("/exercise/:id", deleteExercise);

// folders
router.get("/folders", getFolders);
router.post("/folder", validateFolderInput, createFolder);
router.delete("/folder/:id", deleteFolder);

// routines
router.get("/routines", getRoutines);
router.post("/routine", validateRoutineInput, createRoutine);
router.delete("/routine/:id", deleteRoutine);

// routine_exercise
router.get("/routine/:id/exercises", (): void => {});
router.post(
  "/routine/:id/exercise",
  validateRoutineExerciseInput,
  (): void => {},
);
router.put(
  "/routine/:routine_id/exercise/:exercise_id",
  validateRoutineExerciseInput,
  (): void => {},
);
router.delete("/routine/:routine_id/exercise/:exercise_id", (): void => {});

// workout
router.get("/workouts", getWorkouts);
router.delete("/workout/:id", deleteWorkout);

// routine_workout
router.get("/routine/:id/workouts", (): void => {});
router.post("/routine/:id/workout", validateWorkoutInput, (): void => {});

router.use(errorHandler);

export default router;
