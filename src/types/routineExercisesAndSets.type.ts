import { set_type } from "@prisma/client";

export type ExercisesAndSets = {
  exercise_id: string;
  index: number;
  rest_timer: number;
  note: string;
  custom_exercise_id: string;
  sets: Set[];
};

export type Set = {
  reps: number;
  weight: number;
  rpe: number;
  index: number;
  set_type: set_type;
};
