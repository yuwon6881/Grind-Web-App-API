import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { fromBuffer } from "file-type";

export const getWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workoutQuery = await prisma.folder.findMany({
      where: {
        user_id: req.user!.id,
      },
      include: {
        Routine: {
          include: {
            Workout: {
              include: {
                Workout_Exercise: {
                  include: {
                    Exercise: true,
                  },
                },
                Workout_Custom_Exercise: {
                  include: {
                    Custom_Exercise: true,
                  },
                },
                Workout_Sets: {
                  include: {
                    Personal_Record: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const workouts = workoutQuery.flatMap((folder) =>
      folder.Routine.flatMap((routine) => routine.Workout),
    );

    const workoutsWithBase64 = await Promise.all(
      workouts.map(async (workout) => {
        const customExercisesWithBase64 = await Promise.all(
          workout.Workout_Custom_Exercise.map(async (customExercise) => {
            if (customExercise.Custom_Exercise.image) {
              const buffer = customExercise.Custom_Exercise.image;
              const type = await fromBuffer(buffer);

              if (type) {
                const imageBase64 = `data:${type.mime};base64,${buffer.toString(
                  "base64",
                )}`;
                return {
                  ...customExercise,
                  Custom_Exercise: {
                    ...customExercise.Custom_Exercise,
                    image: imageBase64,
                  },
                };
              }
            }
            return customExercise;
          }),
        );

        const exercisesWithBase64 = await Promise.all(
          workout.Workout_Exercise.map(async (exercise) => {
            if (exercise.Exercise.image) {
              const buffer = exercise.Exercise.image;
              const type = await fromBuffer(buffer);

              if (type) {
                const imageBase64 = `data:${type.mime};base64,${buffer.toString(
                  "base64",
                )}`;
                return {
                  ...exercise,
                  Exercise: {
                    ...exercise.Exercise,
                    image: imageBase64,
                  },
                };
              }
            }
            return exercise;
          }),
        );

        return {
          ...workout,
          Workout_Custom_Exercise: customExercisesWithBase64,
          Workout_Exercise: exercisesWithBase64,
        };
      }),
    );

    res.json({ success: true, data: workoutsWithBase64 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Error retrieving workouts";
      next(error);
    }
  }
};

export const getWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        Workout_Exercise: {
          include: {
            Exercise: true,
          },
        },
        Workout_Custom_Exercise: {
          include: {
            Custom_Exercise: true,
          },
        },
        Workout_Sets: {
          include: {
            Personal_Record: true,
          },
        },
        belongsTo: { select: { id: true } },
      },
    });

    if (!workout) {
      res.json({ success: false, data: "Workout not found" });
      return;
    }

    const customExercisesWithBase64 = await Promise.all(
      workout.Workout_Custom_Exercise.map(async (customExercise) => {
        if (customExercise.Custom_Exercise.image) {
          const buffer = customExercise.Custom_Exercise.image;
          const type = await fromBuffer(buffer);

          if (type) {
            const imageBase64 = `data:${type.mime};base64,${buffer.toString(
              "base64",
            )}`;
            return {
              ...customExercise,
              Custom_Exercise: {
                ...customExercise.Custom_Exercise,
                image: imageBase64,
              },
            };
          }
        }
        return customExercise;
      }),
    );

    const exercisesWithBase64 = await Promise.all(
      workout.Workout_Exercise.map(async (exercise) => {
        if (exercise.Exercise.image) {
          const buffer = exercise.Exercise.image;
          const type = await fromBuffer(buffer);

          if (type) {
            const imageBase64 = `data:${type.mime};base64,${buffer.toString(
              "base64",
            )}`;
            return {
              ...exercise,
              Exercise: {
                ...exercise.Exercise,
                image: imageBase64,
              },
            };
          }
        }
        return exercise;
      }),
    );

    res.json({
      success: true,
      data: {
        ...workout,
        Workout_Custom_Exercise: customExercisesWithBase64,
        Workout_Exercise: exercisesWithBase64,
      },
    });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.message = "Workout not found";
        customError.name = "inputError";
      } else {
        customError.message = "Error retrieving workout";
      }
      next(customError);
    }
  }
};

export const getInProgressWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workout = await prisma.folder.findFirst({
      where: {
        user_id: req.user!.id,
        Routine: {
          some: {
            Workout: {
              some: {
                status: "IN_PROGRESS",
              },
            },
          },
        },
      },
      include: {
        Routine: {
          include: {
            Workout: {
              where: {
                status: "IN_PROGRESS",
              },
            },
          },
        },
      },
    });

    if (!workout) {
      res.json({ success: false, data: "Workout not found" });
      return;
    }

    res.json({
      success: true,
      data: {
        Workout_ID: workout.Routine[0]?.Workout[0]?.id ?? undefined,
        Routine_ID: workout.Routine[0]?.id ?? undefined,
      },
    });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.message = "Workout not found";
        customError.name = "inputError";
      }
      customError.message = "Error retrieving workout";
      next(customError);
    }
  }
};

export const deleteWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workout = await prisma.workout.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true, data: workout });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.message = "Workout not found";
        customError.name = "inputError";
      } else {
        customError.message = "Error deleting workout";
      }
      next(customError);
    }
  }
};
