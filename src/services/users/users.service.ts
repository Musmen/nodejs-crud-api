import { validate as uuidValidate } from 'uuid';

import { User } from './types/user.type.ts';
import { userDB } from './db/users.db.ts';

class UserService {
  getAllUsers = (): User[] => userDB;

  findCurrentUserById = (currentUserId: string | undefined): User | undefined =>
    userDB.find((user: User) => user.id === currentUserId);

  isUserIdValid = (currentUserId: string | undefined): boolean =>
    Boolean(currentUserId && uuidValidate(currentUserId));
}

export const userService = new UserService();
export { User };
