import { validate as uuidValidate } from 'uuid';

import { findCurrentUserById } from '../services/users.service.ts';
import { buildResponse, getIdFromPathName } from '../common/helpers.ts';
import { userDB } from '../db/users.db.ts';
import {
  STATUS_CODES,
  ENDPOINTS,
  RESPONSE_MESSAGES,
} from '../common/constants.ts';
import { HttpResponse } from '../types/http-response.type.ts';

export const getHandler = (pathname: string): HttpResponse => {
  if (pathname === ENDPOINTS.USERS) {
    return buildResponse({ payload: JSON.stringify(userDB) })
  }

  if (pathname.startsWith(ENDPOINTS.USERS)) {
    const currentUserId = getIdFromPathName(pathname);
    if (!currentUserId || !uuidValidate(currentUserId)) {
      return buildResponse({ payload: RESPONSE_MESSAGES.BAD_REQUEST, statusCode: STATUS_CODES.BAD_REQUEST });
    }

    const currentUser = findCurrentUserById(userDB, currentUserId);
    if (!currentUser) {
      return buildResponse({ payload: RESPONSE_MESSAGES.NOT_FOUND, statusCode: STATUS_CODES.NOT_FOUND });
    }

    return buildResponse({ payload: JSON.stringify(currentUser) })
  }

  return buildResponse({ payload: RESPONSE_MESSAGES.BAD_REQUEST, statusCode: STATUS_CODES.NOT_FOUND });
};
