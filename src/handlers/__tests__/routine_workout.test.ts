import { prismaMock } from "../../singleton";
import { createRoutineWorkouts, getRoutineWorkouts } from "../routine_workout";
import { nestedWorkouts, workout } from "./mockData";
import { request, response, next } from "./mocks";

describe("getRoutineWorkouts", () => {
  describe("when request is valid", () => {
    it("should return list of workouts for the routine", async () => {
      request.params = { id: "1" };
      prismaMock.routine.findMany.mockResolvedValueOnce(nestedWorkouts);
      await getRoutineWorkouts(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [workout],
        }),
      );
    });
  });
  describe("when request is invalid", () => {
    it("should return an error", async () => {
      request.params = { id: "1" };
      prismaMock.routine.findMany.mockRejectedValueOnce(new Error());
      await getRoutineWorkouts(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to retrieve workouts for routine",
        }),
      );
    });
  });
});

describe("createRoutineWorkout", () => {
  describe("when request is valid", () => {
    it("should return list of workouts for the routine", async () => {
      request.params = { id: "1" };
      prismaMock.workout.create.mockResolvedValueOnce(workout);
      await createRoutineWorkouts(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: workout,
        }),
      );
    });
  });
  describe("when request is invalid", () => {
    it("should return an error", async () => {
      request.params = { id: "1" };
      prismaMock.workout.create.mockRejectedValueOnce(new Error());
      await createRoutineWorkouts(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create workouts",
        }),
      );
    });
  });
});
