import * as http from 'node:http';

import { responseService } from '../services/response/response.service.ts';
import { ENDPOINTS } from '../common/constants.ts';

export const postHandler = (pathname: string, request: http.IncomingMessage): void => {
  if (pathname !== ENDPOINTS.USERS) {
    responseService.sendNotFoundEndpoint();
    return;
  }

  let body = '';

  request.on('data', (chunk: string) => {
    console.log(chunk.toString());
    body += chunk.toString();
  });

  request.on('end', () => {
    responseService.send(body);
  });
};

/* 
fetch('http://localhost:4000/api/users', {method: 'POST', body: JSON.stringify({
  id:'0aac4690-9ded-11ef-8309-9d1059eb8175',
  username: 'FETCHED',
  age: 555,
  hobbies: ['very', 'busy', 'person'],
}
)}).then(response => response.json()).then(response => console.log(response));      
*/
