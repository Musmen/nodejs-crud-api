import { User } from '../types/user.type.ts';

export const findCurrentUserById = (userDB: User[], currentUserId: string) =>
  userDB.find((user) => user.id === currentUserId);
