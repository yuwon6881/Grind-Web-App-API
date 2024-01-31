import { prismaMock } from "../../singleton";
import {
  createRoutineExercise,
  deleteRoutineExercise,
  getRoutineExercises,
} from "../routine_exercise";
import {
  custom_exercise,
  exercises,
  nestedRoutineExercises,
  routine,
  routine_custom_exercise,
  routine_exercise,
} from "./mockData";
import { request, response, next } from "./mocks";

describe("getRoutineExercises", () => {
  describe("when request is valid", () => {
    it("should return a list of exercises from the routine", async () => {
      request.params = { id: "1" };
      prismaMock.routine.findMany.mockResolvedValueOnce(nestedRoutineExercises);
      await getRoutineExercises(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: [...exercises, custom_exercise],
      });
    });
  });
  describe("when request is invalid", () => {
    it("should call next with an error", async () => {
      prismaMock.routine.findMany.mockRejectedValueOnce(new Error());
      await getRoutineExercises(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error getting routine exercises" }),
      );
    });
  });
});

describe("createRoutineExercise", () => {
  beforeEach(() => {
    prismaMock.routine.findUnique.mockResolvedValueOnce(routine);
  });
  describe("when request is valid", () => {
    it("should add shows success", async () => {
      prismaMock.$transaction.mockResolvedValueOnce({});
      await createRoutineExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: "Success",
      });
    });
  });
  describe("when request is invalid", () => {
    it("should return routine not found error", async () => {
      prismaMock.routine.findUnique.mockReset();
      prismaMock.routine.findUnique.mockResolvedValueOnce(null);
      await createRoutineExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Routine not found" }),
      );
    });
    it("should return error adding exercise to routine", async () => {
      prismaMock.$transaction.mockRejectedValueOnce(new Error());
      await createRoutineExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error adding exercise to routine",
        }),
      );
    });
  });
});

describe("deleteRoutineExercise", () => {
  beforeEach(() => {
    prismaMock.routine.findUnique.mockResolvedValueOnce(routine);
  });
  describe("when request is valid", () => {
    it("should delete a routine_exercise", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.exercise.findUnique.mockResolvedValueOnce(exercises[0]);
      prismaMock.routine_Exercise.delete.mockResolvedValueOnce(
        routine_exercise,
      );
      await deleteRoutineExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: routine_exercise,
      });
    });
    it("should delete a routine_custom_exercise", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.custom_Exercise.findUnique.mockResolvedValueOnce(
        custom_exercise,
      );
      prismaMock.routine_Custom_Exercise.delete.mockResolvedValueOnce(
        routine_custom_exercise,
      );
      await deleteRoutineExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: routine_custom_exercise,
      });
    });
  });
  describe("when request is invalid", () => {
    it("should return error deleting exercise from routine", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.exercise.findUnique.mockResolvedValueOnce(exercises[0]);
      prismaMock.routine_Exercise.delete.mockRejectedValueOnce(new Error());
      await deleteRoutineExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error deleting exercise from routine",
        }),
      );
    });
    it("should return exercise not found error", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.exercise.findUnique.mockResolvedValueOnce(null);
      prismaMock.custom_Exercise.findUnique.mockResolvedValueOnce(null);
      await deleteRoutineExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Exercise not found" }),
      );
    });
    it("should return routine not found error", async () => {
      request.params = { routine_id: "2", exercise_id: "1" };
      prismaMock.routine.findUnique.mockReset();
      prismaMock.routine.findUnique.mockResolvedValueOnce(null);
      await deleteRoutineExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Routine not found" }),
      );
    });
  });
});
