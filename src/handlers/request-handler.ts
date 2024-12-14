import * as http from 'node:http';

import { responseService } from '../services/response/response.service.ts';

import { getHandler } from './get-handler.ts';
import { postHandler } from './post-handler.ts';
import { getPathNameFromUrl } from '../common/helpers.ts';

export const requestHandler: http.RequestListener = (request, response) => {
  responseService.init(response);

  const { method, url } = request;
  const pathname = getPathNameFromUrl(url);

  switch (method) {
    case 'GET':
      getHandler(pathname);
      break;
    case 'POST':
      postHandler(pathname, request);
      break;
  }
};
