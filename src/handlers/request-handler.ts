import * as http from 'node:http';
import cluster from 'node:cluster';

import { responseService } from '../services/response/response.service.ts';
import { pathnameService } from '../services/pathname/pathname.service.ts';

import { getHandler } from './get-handler.ts';
import { postHandler } from './post-handler.ts';
import { putHandler } from './put-handler.ts';
import { deleteHandler } from './delete-handler.ts';

export const requestHandler: http.RequestListener = (request, response) => {
  if (cluster.isWorker) console.log('Current cluster number is: ', cluster.worker?.id);

  try {
    responseService.init(response);

    const { method, url } = request;

    const pathname = pathnameService.getPathnameFromUrl(url);
    if (!pathnameService.checkPathname(pathname)) return;

    const currentUserId = pathnameService.getCurrentUserId(pathname);
    const currentUser = pathnameService.getCurrentUser(currentUserId);

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
      case 'DELETE':
        deleteHandler(currentUserId);
        break;
    }
  } catch {
    responseService.sendServerError();
  }
};
