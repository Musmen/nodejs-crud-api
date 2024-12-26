import { ENDPOINTS, URL_DELIMITER } from './constants.ts';

const parseUrl = (url = '') => new URL(`http://${process.env.HOST ?? 'localhost'}${url}`);

export const getPathnameFromUrl = (url = '') => parseUrl(url).pathname;

export const getIdFromPathname = (pathname: string) =>
  pathname.split(`${ENDPOINTS.USERS}${URL_DELIMITER}`).pop();
