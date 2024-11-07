import * as http from 'node:http';

import { getHandler } from './get-handler.ts';
import { getPathNameFromUrl } from '../common/helpers.ts';
import { STATUS_CODES } from '../common/constants.ts';
import { HttpMethodHandler } from '../types/http-methods-handlers.type.ts';

export const requestHandler: http.RequestListener = (request, response) => {
  const { method, url } = request;
  const pathname = getPathNameFromUrl(url);

  let httpMethodHandlerResult: HttpMethodHandler = {
    payload: '',
    statusCode: STATUS_CODES.BAD_REQUEST,
    header: { name: '', value: '' },
  };

  switch (method) {
    case 'GET':
      httpMethodHandlerResult = getHandler(pathname);
      break;
  }

  const { payload, statusCode, header } = httpMethodHandlerResult;
  response.statusCode = statusCode;
  response.setHeader(header.name, header.value);
  response.end(payload);
};
