import prisma from "../db";

beforeEach(async () => {
  await prisma.$transaction([
    prisma.personal_Record.deleteMany(),
    prisma.workout_Sets.deleteMany(),
    prisma.workout_Exercise.deleteMany(),
    prisma.workout_Custom_Exercise.deleteMany(),
    prisma.workout_Superset.deleteMany(),
    prisma.workout.deleteMany(),
    prisma.routine_Set.deleteMany(),
    prisma.routine_Exercise.deleteMany(),
    prisma.routine_Custom_Exercise.deleteMany(),
    prisma.routine_Superset.deleteMany(),
    prisma.routine.deleteMany(),
    prisma.exercise_Muscle.deleteMany(),
    prisma.custom_Exercise_Muscle.deleteMany(),
    prisma.custom_Muscle_Custom_Exercise.deleteMany(),
    prisma.custom_Exercise.deleteMany(),
    prisma.muscle.deleteMany(),
    prisma.custom_Muscle.deleteMany(),
    prisma.folder.deleteMany(),
    prisma.settings.deleteMany(),
    prisma.user.deleteMany(),
    prisma.exercise.deleteMany(),
  ]);
});
