import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { ExercisesAndSets } from "../types/routineExercisesAndSets.type";
export const getRoutineExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine_exerciseQuery = await prisma.routine.findMany({
      where: {
        id: req.params.id,
      },

      include: {
        Routine_Exercise: {
          include: {
            Exercise: true,
          },
        },
        Routine_Custom_Exercise: {
          include: {
            Custom_Exercise: true,
          },
        },
      },
    });
    const routine_exercises = routine_exerciseQuery.flatMap((routine) => [
      ...routine.Routine_Exercise.map(
        (routine_exercise) => routine_exercise.Exercise,
      ),
      ...routine.Routine_Custom_Exercise.map(
        (routine_custom_exercise) => routine_custom_exercise.Custom_Exercise,
      ),
    ]);
    res.json({ data: routine_exercises });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Error getting routine exercises";
      next(error);
    }
  }
};

export const createRoutineExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine = await prisma.routine.findUnique({
      where: {
        id: req.params.routine_id,
      },
    });
    if (!routine) {
      const error = new Error("Routine not found");
      error.name = "inputError";
      throw error;
    }
    await prisma.$transaction(async (prisma) => {
      await prisma.routine_Exercise.deleteMany({
        where: {
          routine_id: req.params.routine_id,
        },
      });
      await prisma.routine_Custom_Exercise.deleteMany({
        where: {
          routine_id: req.params.routine_id,
        },
      });
      await prisma.routine_Set.deleteMany({
        where: {
          routine_id: req.params.routine_id,
        },
      });

      await Promise.all(
        req.body.exercises.map(async (exercise: ExercisesAndSets) => {
          const data = {
            routine_id: req.params.routine_id,
            index: exercise.index,
            rest_timer: exercise.rest_timer,
            note: exercise.note,
          };

          if (exercise.exercise_id) {
            await prisma.routine_Exercise.create({
              data: { ...data, exercise_id: exercise.exercise_id },
            });
            await prisma.routine_Set.createMany({
              data: exercise.sets.map((set) => ({
                ...set,
                routine_id: req.params.routine_id,
                exercise_id: exercise.exercise_id,
              })),
            });
          } else {
            await prisma.routine_Custom_Exercise.create({
              data: {
                ...data,
                custom_exercise_id: exercise.custom_exercise_id,
              },
            });
            await prisma.routine_Set.createMany({
              data: exercise.sets.map((set) => ({
                ...set,
                routine_id: req.params.routine_id,
                custom_exercise_id: exercise.exercise_id,
              })),
            });
          }
        }),
      );
    });
    res.json({ data: "Success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Error adding exercise to routine";
      next(error);
    }
  }
};

export const deleteRoutineExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine = await prisma.routine.findUnique({
      where: {
        id: req.params.routine_id,
      },
    });
    if (!routine) {
      const error = new Error("Routine not found");
      error.name = "inputError";
      throw error;
    }
    const exercise = await prisma.exercise.findUnique({
      where: {
        id: req.params.exercise_id,
      },
    });
    const custom_exercise = await prisma.custom_Exercise.findUnique({
      where: {
        id: req.params.exercise_id,
      },
    });

    if (exercise) {
      const routine_exercise = await prisma.routine_Exercise.delete({
        where: {
          routine_id_exercise_id: {
            exercise_id: req.params.exercise_id,
            routine_id: req.params.routine_id,
          },
        },
      });
      res.json({ data: routine_exercise });
    } else if (custom_exercise) {
      const routine_custom_exercise =
        await prisma.routine_Custom_Exercise.delete({
          where: {
            routine_id_custom_exercise_id: {
              custom_exercise_id: req.params.exercise_id,
              routine_id: req.params.routine_id,
            },
          },
        });
      res.json({ data: routine_custom_exercise });
    } else {
      const error = new Error("Exercise not found");
      error.name = "inputError";
      throw error;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Error deleting exercise from routine";
      next(error);
    }
  }
};
