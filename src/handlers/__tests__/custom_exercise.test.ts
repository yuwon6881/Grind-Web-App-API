import { prismaMock } from "../../singleton";
import { request, response, next } from "./mocks";
import { custom_exercise, custom_exercise_muscle, user } from "./mockData";
import {
  getCustomExercises,
  getCustomExercise,
  createCustomExercise,
  deleteCustomExercise,
} from "../custom_exercise";
import { muscleType } from "@prisma/client";

// Tests
describe("getCustomExercises", () => {
  describe("when request is valid", () => {
    it("should return custom exercises", async () => {
      prismaMock.custom_Exercise.findMany.mockResolvedValue([custom_exercise]);
      await getCustomExercises(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [custom_exercise],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.custom_Exercise.findMany.mockRejectedValue(new Error());
      await getCustomExercises(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get custom exercises",
        }),
      );
    });
  });
});

describe("getCustomExercise", () => {
  describe("when request is valid", () => {
    it("should return a custom exercise", async () => {
      request.params = { id: "1" };
      prismaMock.custom_Exercise.findUnique.mockResolvedValue(custom_exercise);
      await getCustomExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: custom_exercise,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.params = { id: "1" };
      prismaMock.custom_Exercise.findUnique.mockRejectedValue(new Error());
      await getCustomExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get custom exercise",
        }),
      );
    });
  });
});

describe("createCustomExercise", () => {
  beforeEach(() => {
    request.body = {
      ...custom_exercise,
      muscles: [{ muscleID: "1", muscleType: muscleType.PRIMARY }],
    };
    request.user = user;
  });
  describe("when request is valid", () => {
    it("should return a custom exercise", async () => {
      prismaMock.custom_Exercise.create.mockResolvedValue(custom_exercise);
      prismaMock.custom_Exercise_Muscle.create.mockResolvedValue(
        custom_exercise_muscle,
      );
      prismaMock.$transaction.mockResolvedValue(custom_exercise);
      await createCustomExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: custom_exercise,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.custom_Exercise.create.mockRejectedValue(new Error());
      await createCustomExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create custom exercise",
        }),
      );
    });
    it("should return error", async () => {
      prismaMock.custom_Exercise.create.mockResolvedValue(custom_exercise);
      prismaMock.custom_Exercise_Muscle.create.mockRejectedValue(new Error());
      await createCustomExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create custom exercise",
        }),
      );
    });
  });
});

describe("deleteCustomExercise", () => {
  describe("when request is valid", () => {
    it("should return a custom exercise", async () => {
      request.params = { id: "1" };
      prismaMock.custom_Exercise.delete.mockResolvedValue(custom_exercise);
      await deleteCustomExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: custom_exercise,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.params = { id: "1" };
      prismaMock.custom_Exercise.delete.mockRejectedValue(new Error());
      await deleteCustomExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete custom exercise",
        }),
      );
    });
  });

  describe("when custom exercise is not found", () => {
    it("should return error", async () => {
      request.params = { id: "1" };
      prismaMock.custom_Exercise.delete.mockRejectedValue(
        Object.assign(new Error(), { code: "P2025" }),
      );
      await deleteCustomExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Custom exercise not found",
        }),
      );
    });
  });
});
