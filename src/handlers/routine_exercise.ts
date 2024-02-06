import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { ExercisesAndSets } from "../types/routineExercisesAndSets.type";
export const getRoutineExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine_exercises = await prisma.routine.findMany({
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

    const routine_sets = await prisma.routine_Set.findMany({
      where: {
        routine_id: req.params.id,
      },
    });

    const combined = routine_exercises.flatMap((routine) => [
      ...routine.Routine_Exercise.map((routine_exercise) => ({
        ...routine_exercise.Exercise,
        sets: routine_sets?.filter(
          (set) => set.exercise_id === routine_exercise.exercise_id,
        ),
      })),
      ...routine.Routine_Custom_Exercise.map((routine_custom_exercise) => ({
        ...routine_custom_exercise.Custom_Exercise,
        sets: routine_sets?.filter(
          (set) =>
            set.custom_exercise_id ===
            routine_custom_exercise.custom_exercise_id,
        ),
      })),
    ]);

    res.json({ data: combined });
  } catch (error: unknown) {
    console.log(error);
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
