import dotenv from 'dotenv';
dotenv.config();

import { BASE_URL, ENDPOINTS } from '../common/constants.ts';

const DEFAULT_PORT = '3000';

export const getUrl = (endpoint = ENDPOINTS.USERS): string =>
  `${BASE_URL}:${process.env.PORT ?? DEFAULT_PORT}${endpoint}`;
