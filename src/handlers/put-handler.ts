import * as http from 'node:http';

import { responseService } from '../services/response/response.service.ts';
import { User, userService, UserService } from '../services/users/users.service.ts';

import { getIdFromPathName } from '../common/helpers.ts';
import { ENDPOINTS } from '../common/constants.ts';

export const putHandler = (pathname: string, request: http.IncomingMessage) => {
  if (!pathname.startsWith(ENDPOINTS.USERS)) {
    responseService.sendNotFoundEndpoint();
    return;
  }

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

  let requestBody = '';

  request.on('data', (chunk: string) => {
    requestBody += chunk.toString();
  });

  request.on('end', () => {
    let parsedUser: User;
    try {
      parsedUser = UserService.getParsedUser(requestBody);
    } catch (error) {
      responseService.sendBadRequest((error as Error).message);
      return;
    }

    parsedUser.id = currentUserId;

    const updatedUser: User = userService.updateUser(parsedUser);
    responseService.send(updatedUser);
  });
};
