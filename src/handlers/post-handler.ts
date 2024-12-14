import * as http from 'node:http';

import { sendResponse } from '../common/helpers.ts';
import { ENDPOINTS, RESPONSE_MESSAGES, STATUS_CODES } from '../common/constants.ts';

export const postHandler = (
  pathname: string,
  request: http.IncomingMessage,
  response: http.ServerResponse
): void => {
  if (pathname !== ENDPOINTS.USERS) {
    sendResponse({
      response,
      payload: RESPONSE_MESSAGES.BAD_REQUEST,
      statusCode: STATUS_CODES.NOT_FOUND,
    });
    return;
  }

  let body = '';

  request.on('data', (chunk: string) => {
    console.log(chunk.toString());
    body += chunk.toString();
  });

  request.on('end', () => {
    sendResponse({ response, payload: body });
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
