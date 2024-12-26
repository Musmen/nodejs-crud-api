import { userService, User } from '../services/users/users.service.ts';
import { responseService } from '../services/response/response.service.ts';

import { ENDPOINTS } from '../common/constants.ts';

export const getHandler = (pathname: string, currentUser: User | undefined): void => {
  if (pathname === ENDPOINTS.USERS) {
    const allUsers = userService.getAllUsers();
    responseService.send(allUsers);
    return;
  }

  responseService.send(currentUser);
};
