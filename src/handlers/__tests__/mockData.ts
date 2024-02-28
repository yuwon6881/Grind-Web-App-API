import {
  Folder,
  User,
  Role,
  Exercise,
  exerciseType,
  theme,
  weightUnit,
  previousWorkoutValue,
  Routine,
  Workout,
  status,
  Prisma,
  Custom_Exercise,
  Routine_Exercise,
  Routine_Custom_Exercise,
  Muscle,
  Custom_Muscle,
  Exercise_Muscle,
  muscleType,
  Custom_Exercise_Muscle,
} from "@prisma/client";

type MockFolder = Prisma.FolderGetPayload<{
  include: { Routine: { include: { Workout: true } } };
}>;

type MockRoutine = Prisma.RoutineGetPayload<{
  include: { Workout: true };
}>;

type MockFolderRoutine = Prisma.FolderGetPayload<{
  include: { Routine: true };
}>;

type MockRoutineExerciseAndCustomExercise = Prisma.RoutineGetPayload<{
  include: {
    Routine_Exercise: {
      include: {
        Exercise: true;
      };
    };
    Routine_Custom_Exercise: {
      include: {
        Custom_Exercise: true;
      };
    };
  };
}>;

type MockWorkoutExerciseAndCustomExercise = Prisma.WorkoutGetPayload<{
  include: {
    Workout_Exercise: {
      include: {
        Exercise: true;
      };
    };
    Workout_Custom_Exercise: {
      include: {
        Custom_Exercise: true;
      };
    };
  };
}>;

export const folders: Folder[] = [
  {
    id: "1",
    name: "folder1",
    index: 1,
    user_id: "1",
  },
  {
    id: "2",
    name: "folder2",
    index: 2,
    user_id: "1",
  },
];

export const folder: Folder = {
  id: "1",
  name: "SystemDefault",
  index: -1,
  user_id: "1",
};

export const user: User = {
  id: "1",
  createdAt: new Date(),
  name: "test",
  email: "test@test.com",
  password: "password",
  profilePicture: null,
  role: Role.USER,
};

export const userFolder: User & { Folder: Folder[] } = {
  ...user,
  Folder: folders,
};

export const routine: Routine = {
  id: "1",
  name: "Routine1",
  index: 0,
  folder_id: "1",
};

export const folders_routines = {
  ...folder,
  Routine: [routine],
};

export const signInData = {
  email: "test@test.com",
  password: "test",
};

export const exercises: Exercise[] = [
  {
    id: "1",
    name: "exercise1",
    exerciseType: exerciseType.MACHINE,
    image: null,
  },
  {
    id: "2",
    name: "exercise2",
    exerciseType: exerciseType.BARBELL,
    image: null,
  },
];

export const settings = {
  id: "1",
  theme: theme.LIGHT,
  weightUnit: weightUnit.KG,
  rpe: true,
  previousWorkoutValue: previousWorkoutValue.Default,
  user_id: "1",
};

export const workout: Workout = {
  id: "1",
  start_date: new Date(),
  end_date: null,
  duration: null,
  status: status.IN_PROGRESS,
  routine_id: routine.id,
};

export const custom_exercise: Custom_Exercise = {
  id: "1",
  name: "custom_exercise1",
  image: null,
  exerciseType: exerciseType.BARBELL,
  user_id: user.id,
};

export const nestedFolders: MockFolder[] = [
  {
    id: "1",
    name: "folder1",
    index: 0,
    user_id: "1",
    Routine: [
      {
        id: "1",
        name: "routine1",
        index: 0,
        folder_id: "1",
        Workout: [workout],
      },
    ],
  },
];

export const nestedWorkouts: MockRoutine[] = [
  {
    ...routine,
    Workout: [workout],
  },
];

export const nestedFoldersRoutines: MockFolderRoutine[] = [
  {
    ...folder,
    Routine: [routine],
  },
];

export const nestedRoutineExercises: MockRoutineExerciseAndCustomExercise[] = [
  {
    ...routine,
    Routine_Exercise: [
      {
        routine_id: "1",
        exercise_id: "1",
        index: 0,
        rest_timer: 0,
        note: "note1",
        Exercise: exercises[0],
      },
      {
        routine_id: "1",
        exercise_id: "1",
        index: 0,
        rest_timer: 0,
        note: "note2",
        Exercise: exercises[1],
      },
    ],
    Routine_Custom_Exercise: [
      {
        routine_id: "1",
        custom_exercise_id: "1",
        index: 0,
        rest_timer: 0,
        note: "note1",
        Custom_Exercise: custom_exercise,
      },
    ],
  },
];

export const nestedWorkoutExercises: MockWorkoutExerciseAndCustomExercise[] = [
  {
    ...workout,
    Workout_Exercise: [
      {
        workout_id: "1",
        exercise_id: "1",
        index: 0,
        rest_timer: 0,
        note: "note1",
        Exercise: exercises[0],
      },
      {
        workout_id: "1",
        exercise_id: "1",
        index: 0,
        rest_timer: 0,
        note: "note2",
        Exercise: exercises[1],
      },
    ],
    Workout_Custom_Exercise: [
      {
        workout_id: "1",
        custom_exercise_id: "1",
        index: 0,
        rest_timer: 0,
        note: "note1",
        Custom_Exercise: custom_exercise,
      },
    ],
  },
];

export const routine_exercise: Routine_Exercise = {
  routine_id: routine.id,
  exercise_id: exercises[0].id,
  index: 0,
  rest_timer: null,
  note: null,
};

export const routine_custom_exercise: Routine_Custom_Exercise = {
  routine_id: routine.id,
  custom_exercise_id: custom_exercise.id,
  index: 0,
  rest_timer: null,
  note: null,
};

export const muscle: Muscle = {
  id: "1",
  name: "Muscle1",
};

export const customMuscle: Custom_Muscle = {
  id: "1",
  name: "CustomMuscle1",
  user_id: "1",
};

export const exercise_muscle: Exercise_Muscle = {
  exercise_id: "1",
  muscle_id: "1",
  muscleType: muscleType.PRIMARY,
};

export const custom_exercise_muscle: Custom_Exercise_Muscle = {
  custom_exercise_id: "1",
  muscle_id: "1",
  muscleType: muscleType.PRIMARY,
};
