import * as http from 'node:http';

import { userService } from '../services/users.service.ts';
import { sendResponse, getIdFromPathName } from '../common/helpers.ts';
import { STATUS_CODES, ENDPOINTS, RESPONSE_MESSAGES } from '../common/constants.ts';
import { User } from '../types/user.type.ts';

export const getHandler = (pathname: string, response: http.ServerResponse): void => {
  if (pathname === ENDPOINTS.USERS) {
    const allUsers = userService.getAllUsers();
    sendResponse({ response, payload: JSON.stringify(allUsers) });
    return;
  }

  if (pathname.startsWith(ENDPOINTS.USERS)) {
    const currentUserId: string | undefined = getIdFromPathName(pathname);

    if (!userService.isUserIdValid(currentUserId)) {
      sendResponse({
        response,
        payload: RESPONSE_MESSAGES.BAD_REQUEST,
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
      return;
    }

    const currentUser: User | undefined = userService.findCurrentUserById(currentUserId);
    if (!currentUser) {
      sendResponse({
        response,
        payload: RESPONSE_MESSAGES.NOT_FOUND,
        statusCode: STATUS_CODES.NOT_FOUND,
      });
      return;
    }

    sendResponse({ response, payload: JSON.stringify(currentUser) });
    return;
  }

  sendResponse({
    response,
    payload: RESPONSE_MESSAGES.BAD_REQUEST,
    statusCode: STATUS_CODES.NOT_FOUND,
  });
};
