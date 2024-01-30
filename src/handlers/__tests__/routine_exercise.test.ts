import { prismaMock } from "../../singleton";
import {
  createRoutineExercise,
  getRoutineExercises,
} from "../routine_exercise";
import {
  custom_exercise,
  exercises,
  nestedRoutineExercises,
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
  describe("when request is valid", () => {
    it("should create a routine_exercise", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.exercise.findUnique.mockResolvedValueOnce(exercises[0]);
      prismaMock.custom_Exercise.findUnique.mockResolvedValueOnce(null);
      prismaMock.routine_Exercise.create.mockResolvedValueOnce(
        routine_exercise,
      );
      await createRoutineExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: routine_exercise,
      });
    });
    it("should create a routine_custom_exercise", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.exercise.findUnique.mockResolvedValueOnce(null);
      prismaMock.custom_Exercise.findUnique.mockResolvedValueOnce(
        custom_exercise,
      );
      prismaMock.routine_Custom_Exercise.create.mockResolvedValueOnce(
        routine_custom_exercise,
      );
      await createRoutineExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: routine_custom_exercise,
      });
    });
  });
  describe("when request is invalid", () => {
    it("should return exercise not found error", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.exercise.findUnique.mockResolvedValueOnce(null);
      prismaMock.custom_Exercise.findUnique.mockResolvedValueOnce(null);
      await createRoutineExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Exercise not found" }),
      );
    });
    it("should return error adding exercise to routine", async () => {
      request.params = { routine_id: "1", exercise_id: "1" };
      prismaMock.exercise.findUnique.mockRejectedValueOnce(new Error());
      await createRoutineExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error adding exercise to routine",
        }),
      );
    });
  });
});
