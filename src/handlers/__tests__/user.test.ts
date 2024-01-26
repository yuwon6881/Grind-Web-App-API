import { prismaMock } from "../../singleton";
import { Role, theme, weightUnit, previousWorkoutValue } from "@prisma/client";
import { createNewUser, deleteUser, signIn } from "../user";
import { comparePasswords } from "../../modules/auth";
import { request, response, next } from "./mocks";

jest.mock("../../modules/auth", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
  comparePasswords: jest.fn().mockResolvedValue(true),
  createJWT: jest.fn().mockReturnValue("token"),
}));

// Test data
const user = {
  id: "1",
  name: "test",
  email: "test@test.com",
  password: "test",
  createdAt: new Date(),
  profilePicture: null,
  role: Role.USER,
};

const settings = {
  id: "1",
  theme: theme.LIGHT,
  weightUnit: weightUnit.KG,
  rpe: true,
  previousWorkoutValue: previousWorkoutValue.Default,
  user_id: "1",
};

const signInData = {
  email: "test@test.com",
  password: "test",
};

// Tests

describe("createNewUser", () => {
  describe("when request is valid", () => {
    it("should return a user", async () => {
      request.body = user;
      prismaMock.user.create.mockResolvedValue(user);
      prismaMock.settings.create.mockResolvedValue(settings);
      prismaMock.$transaction.mockResolvedValue([user, settings]);
      await createNewUser(request, response, next);

      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: "token" }),
      );
    });
  });

  describe("when transaction failed", () => {
    it("should return a transaction error", async () => {
      request.body = user;
      prismaMock.$transaction.mockRejectedValue(new Error());
      await createNewUser(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Create user transaction failed",
        }),
      );
    });
  });

  describe("when database failed", () => {
    it("should give me a db error message", async () => {
      request.body = user;
      const dbError = new Error("Database error");
      prismaMock.$transaction.mockRejectedValue(dbError);
      await createNewUser(request, response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Database error",
        }),
      );
    });
  });
});

describe("signIn", () => {
  describe("when request is valid", () => {
    it("should return a token", async () => {
      request.body = signInData;
      prismaMock.user.findUnique.mockResolvedValue(user);
      await signIn(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: "token" }),
      );
    });
  });

  describe("when database failed", () => {
    it("should return a sign in error", async () => {
      request.body = signInData;
      prismaMock.user.findUnique.mockRejectedValue(new Error());
      await signIn(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to sign in",
        }),
      );
    });
  });

  describe("when incorrect password", () => {
    it("should return a password error", async () => {
      request.body = signInData;
      prismaMock.user.findUnique.mockResolvedValue(user);
      (comparePasswords as jest.Mock).mockResolvedValue(false);
      await signIn(request, response, next);
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Invalid password" }),
      );
    });
  });

  describe("when no user found", () => {
    it("should return a user not found error", async () => {
      request.body = signInData;
      prismaMock.user.findUnique.mockResolvedValue(null);
      await signIn(request, response, next);
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "No user found" }),
      );
    });
  });
});

describe("deleteUser", () => {
  describe("when request is valid", () => {
    it("should return deleted user", async () => {
      request.user = user;
      prismaMock.user.delete.mockResolvedValue(user);
      await deleteUser(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: user }),
      );
    });
  });

  describe("when database failed", () => {
    it("should return failed to delete user error", async () => {
      request.user = user;
      prismaMock.user.delete.mockRejectedValue(new Error());
      await deleteUser(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete user",
        }),
      );
    });
  });
});
