import { v1 as uuid, validate as uuidValidate } from 'uuid';

import { userDB } from './db/users.db.ts';
import { ERRORS } from '../../common/constants.ts';

import { User } from './types/user.type.ts';

class UserService {
  getAllUsers = (): User[] => userDB;

  findCurrentUserById = (currentUserId: string | undefined): User | undefined =>
    userDB.find((user: User) => user.id === currentUserId);

  static checkUserId = (currentUserId: string | undefined): boolean =>
    Boolean(currentUserId && uuidValidate(currentUserId));

  addUser = (user: User): User => {
    user.id = uuid();
    userDB.push(user);
    return user;
  };

  static getParsedUser = (user: string): User => {
    let parsedUser: User;

    try {
      parsedUser = JSON.parse(user) as User;
    } catch {
      throw new Error(ERRORS.USER_INVALID_TYPE);
    }

    if (!parsedUser.username) throw new Error(ERRORS.REQUIRED.NAME);
    if (!parsedUser.age) throw new Error(ERRORS.REQUIRED.AGE);
    if (!Array.isArray(parsedUser.hobbies)) throw new Error(ERRORS.REQUIRED.HOBBIES);

    return parsedUser;
  };
}

export const userService = new UserService();
export { User, UserService };
