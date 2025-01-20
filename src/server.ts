import dotenv from 'dotenv';
dotenv.config();

import * as http from 'node:http';
import { requestHandler } from './handlers/request-handler.ts';

export const startServer = (port = Number(process.env.PORT)): http.Server => {
  const server = http.createServer();
  server.on('request', requestHandler);
  server.listen(port);
  return server;
};

export const closeServer = (server: http.Server) => server.close();
