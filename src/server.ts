import dotenv from 'dotenv';
dotenv.config();

import * as http from 'node:http';
import { requestHandler } from './handlers/request-handler.ts';

export const server = http.createServer();

export const startServer = (): void => {
  server.on('request', requestHandler);
  server.listen(process.env.PORT);
};

export const closeServer = () => server.close();
