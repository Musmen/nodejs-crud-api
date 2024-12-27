import * as http from 'node:http';

import { responseService } from '../services/response/response.service.ts';
import { User, userService, UserService } from '../services/users/users.service.ts';

export const putHandler = (request: http.IncomingMessage, currentUserId: string | undefined) => {
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
