import { ENDPOINTS, HEADERS, STATUS_CODES, URL_DELIMITER } from './constants.ts';
import { HttpResponse } from '../types/http-response.type.ts';

const parseUrl = (url = '') =>
  new URL(`http://${process.env.HOST ?? 'localhost'}${url}`);

export const getPathNameFromUrl = (url = '') => parseUrl(url).pathname;

export const getIdFromPathName = (pathname: string) => {
  const id = pathname.split(`${ENDPOINTS.USERS}${URL_DELIMITER}`).pop();
  return id;
};

export const buildResponse = (
  { payload, statusCode }: { payload: string, statusCode?: number }
): HttpResponse => {
  return {
    payload,
    statusCode: statusCode ? statusCode : STATUS_CODES.OK,
    header: statusCode ? HEADERS.CONTENT.TEXT : HEADERS.CONTENT.JSON,
  };
}
