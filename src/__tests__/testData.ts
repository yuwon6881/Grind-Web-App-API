import { exerciseType } from "@prisma/client";

export const user = {
  name: "test",
  email: "test@test.com",
  password: "password",
};

export const signInUser = {
  ...user,
  name: undefined,
};

export const exercise = {
  name: "Squat",
  image: null,
  exerciseType: exerciseType.BARBELL,
};
