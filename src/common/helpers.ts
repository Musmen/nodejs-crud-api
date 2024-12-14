import { ENDPOINTS, URL_DELIMITER } from './constants.ts';

const parseUrl = (url = '') => new URL(`http://${process.env.HOST ?? 'localhost'}${url}`);

export const getPathNameFromUrl = (url = '') => parseUrl(url).pathname;

export const getIdFromPathName = (pathname: string) => {
  const id = pathname.split(`${ENDPOINTS.USERS}${URL_DELIMITER}`).pop();
  return id;
};
