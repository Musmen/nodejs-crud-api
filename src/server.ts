import dotenv from 'dotenv';
dotenv.config();

import * as http from 'node:http';
import { requestHandler } from './handlers/request-handler.ts';

export const startServer = (): http.Server => {
  const server = http.createServer();
  server.on('request', requestHandler);
  server.listen(process.env.PORT);
  return server;
};

export const closeServer = (server: http.Server) => server.close();
