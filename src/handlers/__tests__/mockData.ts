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
} from "@prisma/client";

type MockFolder = Prisma.FolderGetPayload<{
  include: { Routine: { include: { Workout: true } } };
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
