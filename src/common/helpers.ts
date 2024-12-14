import * as http from 'node:http';

import { ENDPOINTS, HEADERS, STATUS_CODES, URL_DELIMITER } from './constants.ts';

const parseUrl = (url = '') => new URL(`http://${process.env.HOST ?? 'localhost'}${url}`);

export const getPathNameFromUrl = (url = '') => parseUrl(url).pathname;

export const getIdFromPathName = (pathname: string) => {
  const id = pathname.split(`${ENDPOINTS.USERS}${URL_DELIMITER}`).pop();
  return id;
};

export const sendResponse = ({
  response,
  payload,
  statusCode,
}: {
  response: http.ServerResponse;
  payload: string;
  statusCode?: number;
}): void => {
  response.statusCode = statusCode ? statusCode : STATUS_CODES.OK;
  const { headerName, headerValue } = statusCode ? HEADERS.CONTENT.TEXT : HEADERS.CONTENT.JSON;
  response.setHeader(headerName, headerValue);
  response.end(payload);
};
