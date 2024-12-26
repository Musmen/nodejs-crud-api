import * as http from 'node:http';

import { responseService, STATUS_CODES } from '../services/response/response.service.ts';
import { User, userService, UserService } from '../services/users/users.service.ts';

import { ENDPOINTS } from '../common/constants.ts';

export const postHandler = (pathname: string, request: http.IncomingMessage) => {
  if (pathname !== ENDPOINTS.USERS) {
    responseService.sendNotFoundEndpoint();
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

    const addedUser: User = userService.addUser(parsedUser);
    responseService.send(addedUser, STATUS_CODES.CREATED);
  });
};
