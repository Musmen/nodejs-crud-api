import { validate as uuidValidate } from 'uuid';
import * as http from 'node:http';

import { findCurrentUserById } from '../services/users.service.ts';
import { sendResponse, getIdFromPathName } from '../common/helpers.ts';
import { userDB } from '../db/users.db.ts';
import {
  STATUS_CODES,
  ENDPOINTS,
  RESPONSE_MESSAGES,
} from '../common/constants.ts';

export const getHandler = (pathname: string, response: http.ServerResponse): void => {
  if (pathname === ENDPOINTS.USERS) {
    sendResponse({ response, payload: JSON.stringify(userDB) });
    return;
  }

  if (pathname.startsWith(ENDPOINTS.USERS)) {
    const currentUserId = getIdFromPathName(pathname);
    if (!currentUserId || !uuidValidate(currentUserId)) {
      sendResponse({ response, payload: RESPONSE_MESSAGES.BAD_REQUEST, statusCode: STATUS_CODES.BAD_REQUEST });
      return;
    }

    const currentUser = findCurrentUserById(userDB, currentUserId);
    if (!currentUser) {
      sendResponse({ response, payload: RESPONSE_MESSAGES.NOT_FOUND, statusCode: STATUS_CODES.NOT_FOUND });
      return;
    }

    sendResponse({ response, payload: JSON.stringify(currentUser) })
    return;
  }

  sendResponse({ response, payload: RESPONSE_MESSAGES.BAD_REQUEST, statusCode: STATUS_CODES.NOT_FOUND });
};
