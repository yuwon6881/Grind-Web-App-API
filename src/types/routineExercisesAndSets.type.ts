import { set_type } from "@prisma/client";

export type RoutineExercisesAndSets = {
  exercise_id: string;
  index: number;
  rest_timer: number;
  note: string;
  custom_exercise_id: string;
  routine_uuid: string;
  sets: Set[];
};

export type WorkoutExercisesAndSets = {
  exercise_id: string;
  index: number;
  rest_timer: number;
  note: string;
  custom_exercise_id: string;
  workout_uuid: string;
  sets: Set[];
};

export type Set = {
  reps: number;
  weight: number;
  rpe: number;
  index: number;
  set_type: set_type;
  set_uuid: string;
};
