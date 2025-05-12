import dotenv from 'dotenv';
dotenv.config();

import { startServer } from './server.ts';
import { startBalancer } from './balancer.ts';

const port = Number(process.env.PORT);

const MULTI_MODE = process.env.MULTI_MODE;

if (!MULTI_MODE) {
  startServer(port);
} else {
  startBalancer(port);
}
