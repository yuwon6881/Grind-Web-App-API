import { prismaMock } from "../../singleton";
import { Request, Response, NextFunction } from "express";
import {
  getExercises,
  getExercise,
  createExercise,
  deleteExercise,
} from "../exercise";
import { Exercise, exerciseType } from "@prisma/client";
import { request, response, next } from "./mocks";

// Test data
const exercises: Exercise[] = [
  {
    id: "1",
    name: "exercise1",
    exerciseType: exerciseType.MACHINE,
    image: null,
  },
  {
    id: "2",
    name: "exercise2",
    exerciseType: exerciseType.BARBELL,
    image: null,
  },
];

// Tests
describe("getExercises", () => {
  // Valid request
  test("should return exercises", async () => {
    prismaMock.exercise.findMany.mockResolvedValue(exercises);
    await getExercises(request, response, next);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: exercises,
      }),
    );
  });

  // Invalid request
  test("should return error", async () => {
    prismaMock.exercise.findMany.mockRejectedValue(new Error());
    await getExercises(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Failed to get exercises",
      }),
    );
  });
});

describe("getExercise", () => {
  // Valid request
  test("should return an exercise", async () => {
    request.params = { id: "1" };
    prismaMock.exercise.findUnique.mockResolvedValue(exercises[0]);
    await getExercise(request, response, next);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: exercises[0],
      }),
    );
  });

  // Invalid request
  test("should return error", async () => {
    request.params = { id: "1" };
    prismaMock.exercise.findUnique.mockRejectedValue(new Error());
    await getExercise(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Failed to get exercise",
      }),
    );
  });
});

describe("createExercise", () => {
  // Valid request
  test("should return an exercise", async () => {
    request.body = exercises[0];
    prismaMock.exercise.create.mockResolvedValue(exercises[0]);
    await createExercise(request, response, next);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: exercises[0],
      }),
    );
  });

  // Invalid request
  test("should return error", async () => {
    request.body = exercises[0];
    prismaMock.exercise.create.mockRejectedValue(new Error());
    await createExercise(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Failed to create exercise",
      }),
    );
  });
});

describe("deleteExercise", () => {
  // Valid request
  test("should return deleted exercise", async () => {
    request.params = { id: "1" };
    prismaMock.exercise.delete.mockResolvedValue(exercises[0]);
    await deleteExercise(request, response, next);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: exercises[0],
      }),
    );
  });

  // Invalid request
  test("should return error", async () => {
    request.params = { id: "1" };
    prismaMock.exercise.delete.mockRejectedValue(new Error());
    await deleteExercise(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Failed to delete exercise",
      }),
    );
  });
});
