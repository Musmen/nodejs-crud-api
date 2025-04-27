/* eslint-disable @typescript-eslint/prefer-optional-chain */
import dotenv from 'dotenv';
dotenv.config();

import * as http from 'node:http';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

import { requestHandler } from './handlers/request-handler.ts';
import { Socket } from 'node:net';

export const startServer = (port = Number(process.env.PORT)): http.Server => {
  if (cluster.isPrimary) {
    let numReqs = 1;
    const numCPUs = availableParallelism();

    for (let numCPU = 0; numCPU < numCPUs; numCPU++) {
      cluster.fork();
    }

    const server = http.createServer();

    server.listen(port);

    server.on('connection', (socket: Socket) => {
      console.log('connection!!!');
      if (cluster.workers && cluster.workers[numReqs]) {
        console.log('sending!!!');
        cluster.workers[numReqs]?.send('socket', socket);
      }
      numReqs = numReqs++ % numCPUs;
    });

    return server;
  } else {
    const server = http.createServer();
    server.on('request', requestHandler);
    // server.listen(port + Number(cluster.worker?.id ?? 0));

    process.on('message', (message: string, socket: Socket) => {
      if (message === 'socket') {
        console.log(`Worker received socket`);
        server.emit('connection', socket);
        socket.resume();
      }
    });

    return server;
  }
};

// export const startServer = (port = Number(process.env.PORT)): http.Server => {
//   const server = http.createServer();
//   server.on('request', requestHandler);
//   server.listen(port);
//   return server;
// };

export const closeServer = (server: http.Server) => server.close();
