import { prismaMock } from "../../singleton";
import { getRoutineExercises } from "../routine_exercise";
import { custom_exercise, exercises, nestedRoutineExercises } from "./mockData";
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
