import { request, response, next } from "./mocks";
import { nestedFolders, user, workout } from "./mockData";
import { deleteWorkout, getWorkouts } from "../workout";
import { prismaMock } from "../../singleton";

describe("getWorkouts", () => {
  describe("when request is valid", () => {
    it("should return workouts", async () => {
      request.user = user;
      prismaMock.folder.findMany.mockResolvedValueOnce(nestedFolders);
      await getWorkouts(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: [workout],
      });
    });
  });
  describe("when request is invalid", () => {
    it("should call next with error", async () => {
      request.user = user;
      prismaMock.folder.findMany.mockRejectedValueOnce(new Error());
      await getWorkouts(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error retrieving workouts" }),
      );
    });
  });
});

describe("deleteWorkout", () => {
  describe("when request is valid", () => {
    it("should delete workout", async () => {
      request.params = { id: "1" };
      prismaMock.workout.delete.mockResolvedValueOnce(workout);
      await deleteWorkout(request, response, next);
      expect(response.json).toHaveBeenCalledWith({
        data: workout,
      });
    });
  });
  describe("when workout is not found", () => {
    it("should call next with inputError", async () => {
      request.params = { id: "1" };
      prismaMock.workout.delete.mockRejectedValueOnce(
        Object.assign(new Error(), { code: "P2025" }),
      );
      await deleteWorkout(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Workout not found",
          name: "inputError",
        }),
      );
    });
    describe("when request is invalid", () => {
      it("should call next with error", async () => {
        request.params = { id: "1" };
        prismaMock.workout.delete.mockRejectedValueOnce(new Error());
        await deleteWorkout(request, response, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({ message: "Error deleting workout" }),
        );
      });
    });
  });
});
