import prisma from "../db";
import { Request, Response, NextFunction } from "express";

export const getPersonalRecords = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const personalRecords = await prisma.personal_Record.findMany({
      where: {
        user_id: req.user!.id,
      },
    });
    res.json({
      success: true,
      data: personalRecords,
    });
  } catch (error) {
    next(error);
  }
};

export const getPersonalRecordSet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const personalRecordSet = await prisma.workout_Sets.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        weight: true,
        reps: true,
        volume: true,
      },
    });
    res.json({
      success: true,
      data: personalRecordSet,
    });
  } catch (error) {
    next(error);
  }
};

export const createPersonalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const personalRecords = req.body.personal_record;
    const workout_id = req.params.workout_id;
    let largestWorkoutSet;

    if (!Array.isArray(personalRecords)) {
      throw new Error("personalRecords is not an array");
    }

    const results = [];

    for (const record of personalRecords) {
      const workout_set = await prisma.workout.findUnique({
        where: {
          id: workout_id,
        },
        include: {
          Workout_Sets: {
            where: {
              exercise_id: record.exercise_id,
              custom_exercise_id: record.custom_exercise_id,
            },
          },
        },
      });

      if (!workout_set) {
        throw new Error("Workout set not found");
      }

      // If workout sets is more than 1, retrieve the set with highest weight * reps
      if (workout_set.Workout_Sets.length > 1) {
        largestWorkoutSet = workout_set.Workout_Sets.reduce((max, current) => {
          const currentValue = (current.weight ?? 0) * (current.reps ?? 0);
          const maxValue = (max.weight ?? 0) * (max.reps ?? 0);
          return currentValue > maxValue ? current : max;
        });
      } else {
        largestWorkoutSet = workout_set.Workout_Sets[0];
      }

      const deletePersonalRecord = await prisma.personal_Record.deleteMany({
        where: {
          user_id: req.user!.id,
          exercise_id: record.exercise_id,
          custom_exercise_id: record.custom_exercise_id,
        },
      });

      if (!deletePersonalRecord) {
        throw new Error("Failed to delete personal record");
      }

      const personal_Record = await prisma.personal_Record.create({
        data: {
          exercise_id: record.exercise_id,
          custom_exercise_id: record.custom_exercise_id,
          workout_set_id: largestWorkoutSet.id,
          user_id: req.user!.id,
        },
      });

      results.push(personal_Record);
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
