import { v1 as uuid, validate as uuidValidate } from 'uuid';

import { userDB } from './db/users.db.ts';
import { ERRORS } from '../../common/constants.ts';

import { User } from './types/user.type.ts';

class UserService {
  getAllUsers = (): User[] => userDB;

  findCurrentUserById = (currentUserId: string | undefined): User | undefined =>
    userDB.find((user: User) => user.id === currentUserId);

  findCurrentUserIndexById = (currentUserId: string | undefined): number =>
    userDB.findIndex((user: User) => user.id === currentUserId);

  static checkUserId = (currentUserId: string | undefined): boolean =>
    Boolean(currentUserId && uuidValidate(currentUserId));

  addUser = (user: User): User => {
    user.id = uuid();
    userDB.push(user);
    return user;
  };

  updateUser = (user: User): User => {
    const currentUserIndex = this.findCurrentUserIndexById(user.id);
    if (currentUserIndex === -1) throw new Error();
    userDB[currentUserIndex] = user;
    return user;
  };

  removeUser = (currentUserId: string | undefined): void => {
    const currentUserIndex = this.findCurrentUserIndexById(currentUserId);
    if (currentUserIndex === -1) throw new Error();
    userDB.splice(currentUserIndex, 1);
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
