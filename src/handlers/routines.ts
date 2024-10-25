import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { fromBuffer } from "file-type";

// get routines with folder

export const getRoutines = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        user_id: req.user!.id,
      },
      include: {
        Routine: true,
      },
    });

    const routines = folders.flatMap((folder) => folder.Routine);
    res.json({ success: true, data: routines });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get routines";
      next(error);
    }
  }
};

// get a routine
export const getRoutine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine = await prisma.routine.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        Routine_Exercise: {
          include: {
            Exercise: {
              select: {
                image: true,
                name: true,
              },
            },
          },
        },
        Routine_Custom_Exercise: {
          include: {
            Custom_Exercise: {
              select: {
                image: true,
                name: true,
              },
            },
          },
        },
        Routine_Set: true,
        Routine_Superset: {
          include: {
            RoutineSuperset_CustomExercise: true,
            RoutineSuperset_Exercise: true,
          },
        },
      },
    });

    if (!routine) {
      res.json({ success: false, message: "Routine not found" });
      return;
    }

    const routineWithBase64 = async () => {
      const routineExercises = await Promise.all(
        routine.Routine_Exercise.map(async (exercise) => {
          if (exercise.Exercise.image) {
            const buffer = exercise.Exercise.image;
            const type = await fromBuffer(buffer);

            if (type) {
              const imageBase64 = `data:${type.mime};base64,${buffer.toString(
                "base64",
              )}`;
              return {
                ...exercise,
                Exercise: { ...exercise.Exercise, image: imageBase64 },
              };
            }
          }
          return exercise;
        }),
      );

      const routineCustomExercises = await Promise.all(
        routine.Routine_Custom_Exercise.map(async (exercise) => {
          if (exercise.Custom_Exercise.image) {
            const buffer = exercise.Custom_Exercise.image;
            const type = await fromBuffer(buffer);

            if (type) {
              const imageBase64 = `data:${type.mime};base64,${buffer.toString(
                "base64",
              )}`;
              return {
                ...exercise,
                Custom_Exercise: {
                  ...exercise.Custom_Exercise,
                  image: imageBase64,
                },
              };
            }
          }
          return exercise;
        }),
      );

      return {
        ...routine,
        Routine_Exercise: routineExercises,
        Routine_Custom_Exercise: routineCustomExercises,
      };
    };

    routineWithBase64().then((result) => {
      res.json({ success: true, data: result });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to get routine";
      next(error);
    }
  }
};

// delete a routine
export const deleteRoutine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routine = await prisma.routine.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true, data: routine });
  } catch (error: unknown) {
    const customError = error as Error & { code: string };
    if (customError instanceof Error) {
      if (customError.code === "P2025") {
        customError.message = "Routine doesnt exist";
        customError.name = "inputError";
      } else {
        customError.message = "Failed to delete routine";
      }
      next(customError);
    }
  }
};

export const updateRoutine = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const routineUpdates = req.body as { id: string; index: number }[];

    const updatePromises = routineUpdates.map((routine) =>
      prisma.routine.update({
        where: {
          id: routine.id,
        },
        data: {
          index: routine.index,
        },
      }),
    );

    const updatedRoutines = await prisma.$transaction(updatePromises);

    res.json({ success: true, data: updatedRoutines });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to update routines";
      next(error);
    }
  }
};

export const updateRoutineName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name } = req.body;

    const updatedRoutine = await prisma.routine.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
      },
    });

    res.json({ success: true, data: updatedRoutine });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Failed to update routine name";
      next(error);
    }
  }
};
