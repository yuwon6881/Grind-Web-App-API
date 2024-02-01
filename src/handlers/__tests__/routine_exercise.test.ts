import { prismaMock } from "../../singleton";
import {
  createRoutineExercise,
  getRoutineExercises,
} from "../routine_exercise";
import {
  custom_exercise,
  exercises,
  nestedRoutineExercises,
  routine,
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
