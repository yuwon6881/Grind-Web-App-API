import { prismaMock } from "../../singleton";
import {
  getExercises,
  getExercise,
  createExercise,
  deleteExercise,
} from "../exercise";
import { request, response, next } from "./mocks";
import { exercise_muscle, exercises } from "./mockData";
import { muscleType } from "@prisma/client";

// Tests
describe("getExercises", () => {
  describe("when request is valid", () => {
    it("should return exercises", async () => {
      prismaMock.exercise.findMany.mockResolvedValue(exercises);
      await getExercises(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: exercises,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.exercise.findMany.mockRejectedValue(new Error());
      await getExercises(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get exercises",
        }),
      );
    });
  });
});

describe("getExercise", () => {
  describe("when request is valid", () => {
    it("should return an exercise", async () => {
      request.params = { id: "1" };
      prismaMock.exercise.findUnique.mockResolvedValue(exercises[0]);
      await getExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: exercises[0],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
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
});

describe("createExercise", () => {
  beforeEach(() => {
    request.body = {
      ...exercises[0],
      muscles: [{ muscleID: "1", muscleType: muscleType.PRIMARY }],
    };
  });
  describe("when request is valid", () => {
    it("should return an exercise", async () => {
      prismaMock.exercise.create.mockResolvedValue(exercises[0]);
      prismaMock.exercise_Muscle.create.mockResolvedValue(exercise_muscle);
      prismaMock.$transaction.mockResolvedValue(exercises[0]);
      await createExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: exercises[0],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.exercise.create.mockRejectedValue(new Error());
      await createExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create exercise",
        }),
      );
    });
    it("should return error", async () => {
      prismaMock.exercise.create.mockResolvedValue(exercises[0]);
      prismaMock.exercise_Muscle.create.mockRejectedValue(new Error());
      await createExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create exercise",
        }),
      );
    });
  });
});

describe("deleteExercise", () => {
  describe("when request is valid", () => {
    it("should return deleted exercise", async () => {
      request.params = { id: "1" };
      prismaMock.exercise.delete.mockResolvedValue(exercises[0]);
      await deleteExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: exercises[0],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
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

  describe("when exercise is not found", () => {
    it("should return error", async () => {
      request.params = { id: "1" };
      prismaMock.exercise.delete.mockRejectedValue(
        Object.assign(new Error(), { code: "P2025" }),
      );
      await deleteExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Exercise not found",
        }),
      );
    });
  });
});
