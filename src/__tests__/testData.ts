import { Role, exerciseType, set_type } from "@prisma/client";

export const user = {
  name: "test",
  email: "test@test.com",
  password: "password",
  confirmPassword: "password",
  role: Role.USER,
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

export const custom_exercise = {
  name: "Single Leg Deadlift",
  exerciseType: exerciseType.DUMBBELL,
};

export const muscle = {
  name: "Quads",
};

export const custom_muscle = {
  name: "Calves",
};

export function addRoutineExerciseAndCustomExerciseWithSets(
  exercise_id: string,
  custom_exercise_id: string,
) {
  return {
    exercises: [
      {
        exercise_id: exercise_id,
        routine_uuid: "uuid1",
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
            set_uuid: "uuid1",
          },
          {
            reps: 4,
            weight: 90,
            rpe: 10,
            index: 0,
            set_type: set_type.DROPSET,
            set_uuid: "uuid2",
          },
        ],
      },
      {
        custom_exercise_id: custom_exercise_id,
        routine_uuid: "uuid2",
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
            set_uuid: "uuid3",
          },
        ],
      },
    ],
  };
}

export const addWorkoutExerciseAndCustomExerciseWithSets = (
  exercise_id: string,
  custom_exercise_id: string,
) => {
  return {
    exercises: [
      {
        exercise_id: exercise_id,
        workout_uuid: "uuid1",
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
            set_uuid: "uuid1",
          },
          {
            reps: 4,
            weight: 90,
            rpe: 10,
            index: 0,
            set_type: set_type.DROPSET,
            set_uuid: "uuid2",
          },
        ],
      },
      {
        custom_exercise_id: custom_exercise_id,
        workout_uuid: "uuid2",
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
            set_uuid: "uuid3",
          },
        ],
      },
    ],
  };
};
