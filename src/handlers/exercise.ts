import { Exercise, muscleType } from "@prisma/client";
import prisma from "../db";
import { Request, Response, NextFunction } from "express";
import { fromBuffer } from "file-type";

// get all exercises
export const getExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: {
        Exercise_Muscle: {
          select: {
            muscleType: true,
            Muscle: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const exercisesWithBase64 = await Promise.all(
      exercises.map(async (exercise) => {
        if (exercise.image) {
          const buffer = exercise.image;
          const type = await fromBuffer(buffer);

          if (type) {
            const imageBase64 = `data:${type.mime};base64,${buffer.toString(
              "base64",
            )}`;
            return { ...exercise, image: imageBase64 };
          }
        }
        return exercise;
      }),
    );

    res.json({ success: true, data: exercisesWithBase64 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get exercises";
      next(error);
    }
  }
};

// get one exercise
export const getExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let exercisesWithBase64;
    const workoutQuery = await prisma.folder.findMany({
      where: {
        user_id: req.user?.id,
      },
      select: {
        Routine: {
          select: {
            Workout: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const workout_IDs = workoutQuery.flatMap((folder) =>
      folder.Routine.flatMap((routine) =>
        routine.Workout.map((workout) => workout.id),
      ),
    );

    const exerciseQuery = await prisma.folder.findMany({
      where: {
        user_id: req.user?.id,
      },
      select: {
        Routine: {
          select: {
            Workout: {
              select: {
                Workout_Exercise: {
                  select: {
                    Exercise: {
                      select: {
                        id: true,
                        name: true,
                        image: true,
                        exerciseType: true,
                        Workout_Sets: {
                          select: {
                            weight: true,
                            reps: true,
                            volume: true,
                            Workout: {
                              select: {
                                id: true,
                                start_date: true,
                              },
                            },
                          },
                        },
                        Exercise_Muscle: {
                          select: {
                            muscleType: true,
                            Muscle: {
                              select: {
                                name: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const exercises = exerciseQuery.flatMap((folder) =>
      folder.Routine.flatMap((routine) =>
        routine.Workout.flatMap((workout) =>
          workout.Workout_Exercise.map((workoutExercise) => {
            const exercise = workoutExercise.Exercise;
            if (exercise.id === req.params.id) {
              exercise.Workout_Sets = exercise.Workout_Sets.filter((set) => {
                return workout_IDs.includes(set.Workout.id);
              });
              return exercise;
            }
            return null;
          }).filter(exercise => exercise !== null),
        ),
      ),
    );

    const exercise = exercises.length > 0 ? exercises[0] : null;

    if (!exercise) {
      const exerciseNoData = await prisma.exercise.findUnique({
        where: {
          id: req.params.id,
        },
        select: {
          id: true,
          name: true,
          image: true,
          exerciseType: true,
          Workout_Sets: {
            select: {
              weight: true,
              reps: true,
              volume: true,
              Workout: {
                select: {
                  start_date: true,
                },
              },
            },
          },
          Exercise_Muscle: {
            select: {
              muscleType: true,
              Muscle: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!exerciseNoData) {
        const error = new Error();
        error.message = "Exercise not found";
        error.name = "inputError";
        throw error;
      }

      exercisesWithBase64 = { ...exerciseNoData };

      if (exerciseNoData.image) {
        const buffer = exerciseNoData.image;
        const type = await fromBuffer(buffer);
        if (type) {
          const imageBase64 = `data:${type.mime};base64,${buffer.toString(
            "base64",
          )}`;
          exercisesWithBase64 = { ...exerciseNoData, image: imageBase64 };
        }
      } else {
        exercisesWithBase64 = { ...exerciseNoData };
      }

      res.json({
        success: true,
        data: exercisesWithBase64,
        noData: true,
      });
      return;
    }
    if (!exercise) {
      const error = new Error();
      error.message = "Exercise not found";
      error.name = "inputError";
      throw error;
    }
    exercisesWithBase64 = { ...exercise };

    if (exercise.image) {
      const buffer = exercise.image;
      const type = await fromBuffer(buffer);
      if (type) {
        const imageBase64 = `data:${type.mime};base64,${buffer.toString(
          "base64",
        )}`;
        exercisesWithBase64 = { ...exercise, image: imageBase64 };
      }
    } else {
      exercisesWithBase64 = { ...exercise };
    }

    if (exercisesWithBase64!.Workout_Sets) {
      exercisesWithBase64!.Workout_Sets.sort((a, b) => {
        const dateA = new Date(a.Workout.start_date);
        const dateB = new Date(b.Workout.start_date);
        return dateA.getTime() - dateB.getTime();
      });
    }

    res.json({ success: true, data: exercisesWithBase64, noData: false });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to get exercise";
      next(error);
    }
  }
};

// create an exercise
export const createExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercise: Exercise = await prisma.$transaction(
      async (prisma): Promise<Exercise> => {
        const transaction_exercise = await prisma.exercise.create({
          data: {
            name: req.body.name,
            exerciseType: req.body.exerciseType,
          },
        });

        const muscles: { muscleID: string; muscleType: muscleType }[] =
          JSON.parse(req.body.muscles);

        const transaction_promises = muscles.map(async (muscle) => {
          const muscleExists = await prisma.muscle.findUnique({
            where: {
              id: muscle.muscleID,
            },
          });
          if (!muscleExists) {
            const error = new Error("Muscle not found");
            error.name = "inputError";
            throw error;
          }
          return prisma.exercise_Muscle.create({
            data: {
              Exercise: {
                connect: {
                  id: transaction_exercise.id,
                },
              },
              Muscle: {
                connect: {
                  id: muscle.muscleID,
                },
              },
              muscleType: muscle.muscleType,
            },
          });
        });

        await Promise.all(transaction_promises);

        return transaction_exercise;
      },
    );
    if (!exercise) {
      throw new Error();
    }
    res.json({ success: true, data: exercise });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = error.message || "Failed to create exercise";
      next(error);
    }
  }
};

// delete an exercise
export const deleteExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deleted = await prisma.exercise.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true, data: deleted });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.name = "inputError";
        customError.message = "Exercise not found";
      }
      customError.message = customError.message || "Failed to delete exercise";
      next(customError);
    }
  }
};
