import { prismaMock } from "../../singleton";
import { Role, theme, weightUnit, previousWorkoutValue } from "@prisma/client";
import { createNewUser } from "../user";
import { Request, Response, NextFunction } from "express";
import exp from "constants";

const request = {
  body: {},
} as Request;
const response = {
  json: jest.fn().mockImplementation((json) => json),
  status: jest.fn().mockImplementation((status) => status),
} as unknown as Response;
const next = jest.fn();
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

test("should create a new user", async () => {
  request.body = user;
  prismaMock.user.create.mockResolvedValue(user);
  prismaMock.settings.create.mockResolvedValue(settings);
  await createNewUser(request, response, next);

  expect(response.json).toHaveBeenCalledWith(
    expect.objectContaining({ token: expect.any(String) }),
  );
});
