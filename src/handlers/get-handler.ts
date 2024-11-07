import { validate as uuidValidate } from 'uuid';

import { findCurrentUserById } from '../services/users.service.ts';
import { getIdFromPathName } from '../common/helpers.ts';
import { userDB } from '../db/users.db.ts';
import {
  STATUS_CODES,
  ENDPOINTS,
  RESPONSE_MESSAGES,
} from '../common/constants.ts';
import { HttpMethodHandler } from '../types/http-methods-handlers.type.ts';

export const getHandler = (pathname: string): HttpMethodHandler => {
  if (pathname === ENDPOINTS.USERS) {
    return {
      payload: JSON.stringify(userDB),
      statusCode: STATUS_CODES.OK,
      header: { name: 'Content-Type', value: 'application/json' },
    };
  }

  if (pathname.startsWith(ENDPOINTS.USERS)) {
    const currentUserId = getIdFromPathName(pathname);
    if (!currentUserId || !uuidValidate(currentUserId)) {
      return {
        payload: RESPONSE_MESSAGES.BAD_REQUEST,
        statusCode: STATUS_CODES.BAD_REQUEST,
        header: { name: 'Content-Type', value: 'text/plain' },
      };
    }

    const currentUser = findCurrentUserById(userDB, currentUserId);
    if (!currentUser) {
      return {
        payload: RESPONSE_MESSAGES.NOT_FOUND,
        statusCode: STATUS_CODES.NOT_FOUND,
        header: { name: 'Content-Type', value: 'text/plain' },
      };
    }

    return {
      payload: JSON.stringify(currentUser),
      statusCode: STATUS_CODES.OK,
      header: { name: 'Content-Type', value: 'application/json' },
    };
  }

  return {
    payload: RESPONSE_MESSAGES.BAD_REQUEST,
    statusCode: STATUS_CODES.NOT_FOUND,
    header: { name: 'Content-Type', value: 'text/plain' },
  };
};
