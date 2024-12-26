import * as http from 'node:http';

import { HEADERS, RESPONSE_MESSAGES, STATUS_CODES } from './common/constants.ts';
import { HttpResponse } from './types/http-response.type';

class ResponseService {
  response: http.ServerResponse | undefined = undefined;

  private sendResponse = ({ payload, statusCode }: HttpResponse): void => {
    if (!this.response) return;

    this.response.statusCode = statusCode ? statusCode : STATUS_CODES.OK;
    const { headerName, headerValue } =
      this.response.statusCode >= STATUS_CODES.BAD_REQUEST
        ? HEADERS.CONTENT.TEXT
        : HEADERS.CONTENT.JSON;
    this.response.setHeader(headerName, headerValue);
    this.response.end(payload);
  };

  init = (response: http.ServerResponse) => {
    this.response = response;
  };

  send = (payload: unknown, statusCode = STATUS_CODES.OK) => {
    this.sendResponse({ payload: JSON.stringify(payload), statusCode });
  };

  sendBadRequest = (message: string = RESPONSE_MESSAGES.BAD_REQUEST) => {
    this.sendResponse({
      payload: message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  };

  sendNotFoundData = () => {
    this.sendResponse({
      payload: RESPONSE_MESSAGES.NOT_FOUND,
      statusCode: STATUS_CODES.NOT_FOUND,
    });
  };

  sendNotFoundEndpoint = () => {
    this.sendResponse({
      payload: RESPONSE_MESSAGES.BAD_REQUEST,
      statusCode: STATUS_CODES.NOT_FOUND,
    });
  };
}

export const responseService = new ResponseService();
export { STATUS_CODES };
