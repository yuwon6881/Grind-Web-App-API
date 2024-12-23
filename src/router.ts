import { Router } from "express";
import multer from "multer";
import {
  createFolder,
  deleteFolder,
  getDefaultFolder,
  getFolders,
  updateFolder,
} from "./handlers/folder";
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
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  userSignOut,
} from "./handlers/user";
import { errorHandler } from "./middlewares/errorhandler";
import { validateFolderRoutineInput } from "./middlewares/validateFolderRoutineInput";
import {
  deleteRoutine,
  getRoutine,
  getRoutines,
  updateRoutine,
  updateRoutineName,
} from "./handlers/routines";
import { createRoutine, updateFolderRoutine } from "./handlers/folder_routines";
import {
  deleteWorkout,
  getInProgressWorkout,
  getWorkout,
  getWorkouts,
  updateWorkout,
} from "./handlers/workout";
import {
  createRoutineWorkouts,
  getRoutineWorkouts,
} from "./handlers/routine_workout";
import {
  createRoutineExercise,
  deleteRoutineExercises,
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
import {
  createMuscle,
  deleteMuscle,
  getMuscle,
  getMuscles,
} from "./handlers/muscle";
import {
  deleteCustomMuscle,
  getCustomMuscle,
  getCustomMuscles,
} from "./handlers/custom_muscle";
import { validateMuscleInput } from "./middlewares/validateMuscleInput";
import { validateCustomMuscleInput } from "./middlewares/validateCustomMuscleInput";
import { validateUpdateUserInput } from "./middlewares/validateUpdateUserInput";
import {
  createRoutineSuperset,
  getRoutineSupersets,
} from "./handlers/routine_superset";
import {
  createWorkoutSuperset,
  getWorkoutSupersets,
} from "./handlers/workout_superset";
import {
  createPersonalRecord,
  getPersonalRecords,
  getPersonalRecordSet,
} from "./handlers/personal_record";

const upload = multer();
const router = Router();

//user
router.post("/userSignOut", userSignOut);
router.get("/user", getUser);
router.get("/users", getUsers);
router.delete("/user", deleteUser);
router.put(
  "/user",
  upload.single("profilePicture"),
  validateUpdateUserInput,
  updateUser,
);

// settings
router.get("/setting", getSetting);
router.put("/setting", validateSettingInput, updateSetting);

// exercises
router.get("/exercises", getExercises);
router.get("/exercise/:id", getExercise);
router.post("/exercise", validateExerciseInput, createExercise);
router.delete("/exercise/:id", deleteExercise);

// custom_exercises
router.get("/custom_exercises", getCustomExercises);
router.get("/custom_exercise/:id", getCustomExercise);
router.post(
  "/custom_exercise",
  upload.single("image"),
  validateExerciseInput,
  createCustomExercise,
);
router.delete("/custom_exercise/:id", deleteCustomExercise);

// muscles
router.get("/muscles", getMuscles);
router.get("/muscle/:id", getMuscle);
router.post("/muscle", validateMuscleInput, createMuscle);
router.delete("/muscle/:id", deleteMuscle);

// custom_muscles
router.get("/custom_muscles", getCustomMuscles);
router.get("/custom_muscle/:id", getCustomMuscle);
router.post("/custom_muscle", validateCustomMuscleInput, createMuscle);
router.delete("/custom_muscle/:id", deleteCustomMuscle);

// folders
router.get("/folders", getFolders);
router.get("/defaultFolder", getDefaultFolder);
router.post("/folder", validateFolderInput, createFolder);
router.put("/folder", updateFolder);
router.delete("/folder/:id", deleteFolder);

// routines
router.get("/routines", getRoutines);
router.get("/routine/:id", getRoutine);
router.put("/routine", updateRoutine);
router.put("/routine/:id", updateRoutineName);
router.delete("/routine/:id", deleteRoutine);

//folder_routines
router.post("/folder/:id/routine", validateFolderRoutineInput, createRoutine);
router.put("/folder/:folder_id/routine/:routine_id", updateFolderRoutine);

// routine_exercise
router.get("/routine/:id/exercises", getRoutineExercises);
router.post(
  "/routine/:routine_id/exercises",
  validateRoutineExerciseInput,
  createRoutineExercise,
);
router.delete("/routine/:routine_id/exercises", deleteRoutineExercises);

// workout_exercises
router.get("/workout/:id/exercises", getWorkoutExercises);
router.post(
  "/workout/:id/exercises",
  validateWorkoutExerciseInput,
  createWorkoutExercise,
);

// workout
router.get("/workouts", getWorkouts);
router.get("/workout/:id", getWorkout);
router.put("/workout/:id", updateWorkout);
router.get("/workoutInProgress", getInProgressWorkout);
router.delete("/workout/:id", deleteWorkout);

// routine_workout
router.get("/routine/:id/workouts", getRoutineWorkouts);
router.post("/routine/:id/workout", createRoutineWorkouts);

// routine_superset
router.get("/routine/:id/superset", getRoutineSupersets);
router.post("/routine/:id/superset", createRoutineSuperset);

//workout_superset
router.get("/workout/:id/superset", getWorkoutSupersets);
router.post("/workout/:id/superset", createWorkoutSuperset);

// personal_records
router.get("/personal_records", getPersonalRecords);
router.get("/personal_record_set/:id", getPersonalRecordSet);
router.post("/personal_record/:workout_id", createPersonalRecord);

router.use(errorHandler);

export default router;
