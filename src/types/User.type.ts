import { User } from "@prisma/client";

export type UserWithoutProfilePicture = Omit<User, "profilePicture">;
