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

const router = Router();

//user
router.delete("/user", deleteUser);

// settings
router.get("/setting/:id", getSetting);
router.put("/setting/:id", validateSettingInput, updateSetting);

// exercises
router.get("/exercise", getExercises);
router.get("/exercise/:id", getExercise);
router.post("/exercise", validateExerciseInput, createExercise);
router.delete("/exercise/:id", deleteExercise);

// muscles
router.get("/muscle", (): void => {});
router.get("/muscle/:id", (): void => {});
router.post("/muscle", (): void => {});
router.delete("/muscle/:id", (): void => {});

// exercise_muscles

// folder
router.get("/folders", getFolders);

router.post("/folder", validateFolderInput, createFolder);

router.delete("/folder/:id", deleteFolder);

// folder_routines

// routine_exercises

router.use(errorHandler);

export default router;
