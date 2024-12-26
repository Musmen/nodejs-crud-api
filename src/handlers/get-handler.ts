import { userService, User, UserService } from '../services/users/users.service.ts';
import { responseService } from '../services/response/response.service.ts';

import { getIdFromPathName } from '../common/helpers.ts';
import { ENDPOINTS } from '../common/constants.ts';

export const getHandler = (pathname: string): void => {
  if (pathname === ENDPOINTS.USERS) {
    const allUsers = userService.getAllUsers();
    responseService.send(allUsers);
    return;
  }

  if (pathname.startsWith(ENDPOINTS.USERS)) {
    const currentUserId: string | undefined = getIdFromPathName(pathname);

    if (!UserService.checkUserId(currentUserId)) {
      responseService.sendBadRequest();
      return;
    }

    const currentUser: User | undefined = userService.findCurrentUserById(currentUserId);
    if (!currentUser) {
      responseService.sendNotFoundData();
      return;
    }

    responseService.send(currentUser);
    return;
  }

  responseService.sendNotFoundEndpoint();
};
