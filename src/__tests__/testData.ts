import { exerciseType, set_type } from "@prisma/client";

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

export function addRoutineExerciseAndCustomExerciseWithSets(
  exercise_id: string,
  custom_exercise_id: string,
) {
  return {
    exercises: [
      {
        exercise_id: exercise_id,
        index: 0,
        rest_timer: 0,
        note: "note1",
        sets: [
          {
            reps: 5,
            weight: 100,
            rpe: 9,
            index: 0,
            set_type: set_type.NORMAL,
          },
          {
            reps: 4,
            weight: 90,
            rpe: 10,
            index: 0,
            set_type: set_type.DROPSET,
          },
        ],
      },
      {
        custom_exercise_id: custom_exercise_id,
        index: 0,
        rest_timer: 0,
        note: "note1",
        sets: [
          {
            reps: 5,
            weight: 100,
            rpe: 9,
            index: 0,
            set_type: set_type.NORMAL,
          },
        ],
      },
    ],
  };
}
