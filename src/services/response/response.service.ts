import * as http from 'node:http';
import cluster from 'node:cluster';

import { userService } from '../users/users.service.ts';
import { DB_UPDATE_MESSAGE_TYPE } from '../../common/constants.ts';
import { HEADERS, RESPONSE_MESSAGES, STATUS_CODES } from './common/constants.ts';
import { HttpResponse } from './types/http-response.type';

class ResponseService {
  response: http.ServerResponse | undefined = undefined;

  private sendResponse = ({ payload, statusCode }: HttpResponse): void => {
    if (!this.response) return;

    this.response.statusCode = statusCode ?? STATUS_CODES.OK;
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

    if (cluster.isWorker) {
      process.send?.({
        type: DB_UPDATE_MESSAGE_TYPE,
        data: userService.getAllUsers(),
      });
    }
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

  sendServerError = () => {
    this.sendResponse({
      payload: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
  };
}

export const responseService = new ResponseService();
export { STATUS_CODES, RESPONSE_MESSAGES };
