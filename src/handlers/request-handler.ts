import * as http from 'node:http';

import { responseService } from '../services/response/response.service.ts';
import { User, userService, UserService } from '../services/users/users.service.ts';

import { getHandler } from './get-handler.ts';
import { postHandler } from './post-handler.ts';
import { putHandler } from './put-handler.ts';

import { getIdFromPathName, getPathNameFromUrl } from '../common/helpers.ts';
import { ENDPOINTS } from '../common/constants.ts';

export const requestHandler: http.RequestListener = (request, response) => {
  responseService.init(response);

  const { method, url } = request;
  const pathname = getPathNameFromUrl(url);

  let currentUserId: string | undefined;
  let currentUser: User | undefined;

  if (!pathname.startsWith(ENDPOINTS.USERS)) {
    responseService.sendNotFoundEndpoint();
    return;
  } else if (pathname !== ENDPOINTS.USERS) {
    currentUserId = getIdFromPathName(pathname);
    if (!UserService.checkUserId(currentUserId)) {
      responseService.sendBadRequest();
      return;
    }

    currentUser = userService.findCurrentUserById(currentUserId);
    if (!currentUser) {
      responseService.sendNotFoundData();
      return;
    }
  }

  switch (method) {
    case 'GET':
      getHandler(pathname, currentUser);
      break;
    case 'POST':
      postHandler(request);
      break;
    case 'PUT':
      putHandler(request, currentUserId);
      break;
  }
};
