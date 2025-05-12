import * as http from 'node:http';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

import { startServer } from './server.ts';
import { User, userService } from './services/users/users.service.ts';
import { STATUS_CODES } from './services/response/common/constants.ts';
import { DB_UPDATE_MESSAGE_TYPE, ERRORS } from './common/constants.ts';

interface Message {
  type: string;
  data: User[];
}

export const startBalancer = (port: number): void => {
  if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    for (let numCPU = 1; numCPU < numCPUs; numCPU++) {
      const worker = cluster.fork();

      worker.on('message', (message: Message) => {
        if (message.type !== DB_UPDATE_MESSAGE_TYPE) return;
        for (const id in cluster.workers) {
          if (cluster.workers[id]?.id !== worker.id) cluster.workers[id]?.send(message);
        }
      });
    }

    let requestsCounter = 0;
    const server = http.createServer();
    server.on('request', (request, response) => {
      requestsCounter = ++requestsCounter % numCPUs;

      const proxy = http.request(
        {
          host: 'localhost',
          port: port + requestsCounter,
          path: request.url,
          method: request.method,
          headers: request.headers,
        },
        (proxyResponse) => {
          response.writeHead(proxyResponse.statusCode ?? STATUS_CODES.OK, proxyResponse.headers);
          proxyResponse.pipe(response);
        }
      );

      request.pipe(proxy);

      proxy.on('error', () => {
        response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.end(ERRORS.PROXY);
      });
    });

    server.listen(port);
    return;
  }

  startServer(port + Number(cluster.worker?.id));
  process.on('message', (message: Message) => {
    if (message.type !== DB_UPDATE_MESSAGE_TYPE) return;
    userService.updateAllUsers(message.data);
  });
};
