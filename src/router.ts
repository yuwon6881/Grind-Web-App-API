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
import { validateFolderRoutineInput } from "./middlewares/validateFolderRoutineInput";
import { deleteRoutine } from "./handlers/routines";
import { createRoutine, getRoutine } from "./handlers/folder_routines";
import { deleteWorkout, getWorkouts } from "./handlers/workout";
import {
  createRoutineWorkouts,
  getRoutineWorkouts,
} from "./handlers/routine_workout";
import {
  createRoutineExercise,
  deleteRoutineExercise,
  getRoutineExercises,
} from "./handlers/routine_exercise";
import { validateRoutineExerciseInput } from "./middlewares/validateRoutineExerciseInput";

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
router.delete("/routine/:id", deleteRoutine);

//folder_routines
router.get("/folder/:id/routines", getRoutine);
router.post("/folder/:id/routine", validateFolderRoutineInput, createRoutine);

// routine_exercise
//add or delete exercises includes custom exercises
router.get("/routine/:id/exercises", getRoutineExercises);
router.post(
  "/routine/:routine_id/exercises",
  validateRoutineExerciseInput,
  createRoutineExercise,
);
router.delete(
  "/routine/:routine_id/exercise/:exercise_id",
  deleteRoutineExercise,
);

// Routine_Set

// workout_exercise
//add or delete exercises includes custom exercises

// workout_set

// workout
router.get("/workouts", getWorkouts);
router.delete("/workout/:id", deleteWorkout);

// routine_workout
router.get("/routine/:id/workouts", getRoutineWorkouts);
router.post("/routine/:id/workout", createRoutineWorkouts);

router.use(errorHandler);

export default router;
