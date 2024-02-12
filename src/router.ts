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
import { deleteUser, userSignOut } from "./handlers/user";
import { errorHandler } from "./middlewares/errorhandler";
import { validateFolderRoutineInput } from "./middlewares/validateFolderRoutineInput";
import { deleteRoutine, getRoutines } from "./handlers/routines";
import { createRoutine } from "./handlers/folder_routines";
import { deleteWorkout, getWorkouts } from "./handlers/workout";
import {
  createRoutineWorkouts,
  getRoutineWorkouts,
} from "./handlers/routine_workout";
import {
  createRoutineExercise,
  getRoutineExercises,
} from "./handlers/routine_exercise";
import { validateRoutineExerciseInput } from "./middlewares/validateRoutineExerciseInput";
import {
  createWorkoutExercise,
  getWorkoutExercises,
} from "./handlers/workout_exercise";
import { validateWorkoutExerciseInput } from "./middlewares/validateWorkoutExerciseInput";
import {
  createCustomExercise,
  deleteCustomExercise,
  getCustomExercise,
  getCustomExercises,
} from "./handlers/custom_exercise";

const router = Router();

//user
router.post("/userSignOut", userSignOut);
router.delete("/user", deleteUser);

// settings
router.get("/setting/:id", getSetting);
router.put("/setting/:id", validateSettingInput, updateSetting);

// exercises
router.get("/exercises", getExercises);
router.get("/exercise/:id", getExercise);
router.post("/exercise", validateExerciseInput, createExercise);
router.delete("/exercise/:id", deleteExercise);

// custom_exercises
router.get("/custom_exercises", getCustomExercises);
router.get("/custom_exercise/:id", getCustomExercise);
router.post("/custom_exercise", validateExerciseInput, createCustomExercise);
router.delete("/custom_exercise/:id", deleteCustomExercise);

// folders
router.get("/folders", getFolders);
router.post("/folder", validateFolderInput, createFolder);
router.delete("/folder/:id", deleteFolder);

// routines
router.get("/routines", getRoutines);
router.delete("/routine/:id", deleteRoutine);

//folder_routines
router.post("/folder/:id/routine", validateFolderRoutineInput, createRoutine);

// routine_exercise
router.get("/routine/:id/exercises", getRoutineExercises);
router.post(
  "/routine/:routine_id/exercises",
  validateRoutineExerciseInput,
  createRoutineExercise,
);

// workout_exercises
router.get("/workout/:id/exercises", getWorkoutExercises);
router.post(
  "/workout/:id/exercises",
  validateWorkoutExerciseInput,
  createWorkoutExercise,
);

// workout
router.get("/workouts", getWorkouts);
// router.put("/workout/:id", () => {});
router.delete("/workout/:id", deleteWorkout);

// routine_workout
router.get("/routine/:id/workouts", getRoutineWorkouts);
router.post("/routine/:id/workout", createRoutineWorkouts);

router.use(errorHandler);

export default router;
