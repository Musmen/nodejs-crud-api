import * as http from 'node:http';
import { requestHandler } from './handlers/request-handler.ts';

export const startServer = (): void => {
  const server = http.createServer();
  server.on('request', requestHandler);
  server.listen(4000);
};
