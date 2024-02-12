import { prismaMock } from "../../singleton";
import {
  createWorkoutExercise,
  getWorkoutExercises,
} from "../workout_exercise";
import {
  custom_exercise,
  exercises,
  nestedWorkoutExercises,
  workout,
} from "./mockData";
import { request, response, next } from "./mocks";

describe("getWorkoutExercises", () => {
  describe("when request is valid", () => {
    it("should return a list of exercises from the workout", async () => {
      request.params = { id: "1" };
      prismaMock.workout.findMany.mockResolvedValueOnce(nestedWorkoutExercises);
      await getWorkoutExercises(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: [...exercises, custom_exercise] }),
      );
    });
  });
  describe("when request is invalid", () => {
    it("should call next with an error", async () => {
      prismaMock.workout.findMany.mockRejectedValueOnce(new Error());
      await getWorkoutExercises(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error getting workout exercises" }),
      );
    });
  });
});

describe("createWorkoutExercise", () => {
  beforeEach(() => {
    prismaMock.workout.findUnique.mockResolvedValueOnce(workout);
  });
  describe("when request is valid", () => {
    it("should add shows success", async () => {
      prismaMock.$transaction.mockResolvedValueOnce({});
      await createWorkoutExercise(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        success: true,
      });
    });
  });
  describe("when request is invalid", () => {
    it("should return workout not found error", async () => {
      prismaMock.workout.findUnique.mockReset();
      prismaMock.workout.findUnique.mockResolvedValueOnce(null);
      await createWorkoutExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Workout not found" }),
      );
    });
    it("should return error adding exercise to workout", async () => {
      prismaMock.$transaction.mockRejectedValueOnce(new Error());
      await createWorkoutExercise(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error adding exercise to workout",
        }),
      );
    });
  });
});
