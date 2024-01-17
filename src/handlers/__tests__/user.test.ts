import { prismaMock } from "../../singleton";
import { Role, theme, weightUnit, previousWorkoutValue } from "@prisma/client";
import { createNewUser, deleteUser, signIn } from "../user";
import { Request, Response, NextFunction } from "express";
import { comparePasswords } from "../../modules/auth";

// Mocks
let request: Request, response: Response, next: NextFunction;

beforeAll(() => {
  request = {} as Request;

  response = {
    json: jest.fn().mockImplementation((json) => json),
    status: jest.fn().mockImplementation((status) => status),
  } as unknown as Response;
  next = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

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
  // Valid body
  test("should create a new user", async () => {
    request.body = user;
    prismaMock.user.create.mockResolvedValue(user);
    prismaMock.settings.create.mockResolvedValue(settings);
    prismaMock.$transaction.mockResolvedValue([user, settings]);
    await createNewUser(request, response, next);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "token" }),
    );
  });

  // Failed transaction
  test("should return duplicate email error", async () => {
    request.body = user;
    prismaMock.$transaction.mockRejectedValue({
      code: "P2002",
    });
    await createNewUser(request, response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Email already exists",
        status: 400,
      }),
    );
  });

  //Failed database
  test("should give me a db error message", async () => {
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

describe("signIn", () => {
  // Valid body
  test("should return a token", async () => {
    request.body = signInData;
    prismaMock.user.findUnique.mockResolvedValue(user);
    await signIn(request, response, next);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "token" }),
    );
  });

  // Database error
  test("should return a sign in error", async () => {
    request.body = signInData;
    prismaMock.user.findUnique.mockRejectedValue(new Error());
    await signIn(request, response, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Failed to sign in",
      }),
    );
  });

  // Invalid password
  test("should return a password error", async () => {
    request.body = signInData;
    prismaMock.user.findUnique.mockResolvedValue(user);
    (comparePasswords as jest.Mock).mockResolvedValue(false);
    await signIn(request, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid password" }),
    );
  });

  // No user found
  test("should return a user not found error", async () => {
    request.body = signInData;
    prismaMock.user.findUnique.mockResolvedValue(null);
    await signIn(request, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "No user found" }),
    );
  });

  describe("deleteUser", () => {
    // Valid request
    test("should return deleted user", async () => {
      request.user = user;
      prismaMock.user.delete.mockResolvedValue(user);
      await deleteUser(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: user }),
      );
    });

    // Database error
    test("should return failed to delete user error", async () => {
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
