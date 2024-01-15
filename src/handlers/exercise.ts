import prisma from "../db";
import { Request, Response, NextFunction } from "express";

// get all exercises
export const getExercises = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.json({ data: exercises });
  } catch (err: any) {
    err.message = "Failed to get exercises";
    next(err);
  }
};

// get one exercise
export const getExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json({ data: exercise });
  } catch (err: any) {
    err.message = "Failed to get exercise";
    next(err);
  }
};

// create an exercise
export const createExercise = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const exercise = await prisma.exercise.create({
      data: {
        name: req.body.name,
        exerciseType: req.body.exerciseType,
      },
    });
    res.json({ data: exercise });
  } catch (err: any) {
    err.message = "Failed to create exercise";
    next(err);
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
    res.json({ data: deleted });
  } catch (err: any) {
    err.message = "Failed to delete exercise";
    next(err);
  }
};
