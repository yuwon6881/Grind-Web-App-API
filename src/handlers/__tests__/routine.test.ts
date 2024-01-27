import { getRoutines } from "../routines";
import { prismaMock } from "../../singleton";
import { request, response, next } from "./mocks";
import { user, folders_routines, routine } from "./mockData";

describe("getRoutines", () => {
  describe("when request is valid", () => {
    it("should return routines", async () => {
      request.user = user;
      prismaMock.folder.findMany.mockResolvedValue([folders_routines]);
      await getRoutines(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: [routine] }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.user = user;
      prismaMock.folder.findMany.mockRejectedValue(new Error());
      await getRoutines(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get routines",
        }),
      );
    });
  });
});
