import * as http from 'node:http';

import { getHandler } from './get-handler.ts';
import { postHandler } from './post-handler.ts';
import { /* buildResponse ,*/ getPathNameFromUrl } from '../common/helpers.ts';
// import { RESPONSE_MESSAGES, STATUS_CODES } from '../common/constants.ts';
// import { HttpResponse } from '../types/http-response.type.ts';

export const requestHandler: http.RequestListener = (request, response) =>  {
  const { method, url } = request;
  const pathname = getPathNameFromUrl(url);

  // const httpMethodHandlerResult: HttpResponse = buildResponse(
  //   { payload: RESPONSE_MESSAGES.NOT_FOUND, statusCode: STATUS_CODES.NOT_FOUND }
  // );

  switch (method) {
    case 'GET': 
      getHandler(pathname, response);
      break; 
    case 'POST':
      postHandler(pathname, request, response);
      break;
  }

  // const { payload, statusCode, header }  = httpMethodHandlerResult;
  // response.statusCode = statusCode;
  // response.setHeader(header.name, header.value);
  // response.end(payload);
};
