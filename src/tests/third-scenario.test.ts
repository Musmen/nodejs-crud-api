import * as http from 'node:http';

import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

import { startServer, closeServer } from '../server.ts';

import { RESPONSE_MESSAGES, STATUS_CODES } from '../services/response/response.service.ts';
import { UserService } from '../services/users/users.service.ts';

import { ENDPOINTS, ERRORS } from '../common/constants.ts';

import { UserResponse, UsersResponse } from './types/response.type.ts';

describe('Third test scenario', () => {
  let server: http.Server;
  let request: TestAgent;

  beforeEach(() => {
    server = startServer(0);
    request = supertest(server);
  });

  afterEach(() => {
    closeServer(server);
    UserService.clearUsersDB();
  });

  test('Should answer with status code 400 and corresponding message if request body does not contain required fields in PUT request to update existing user', async () => {
    const response = (await request.get(ENDPOINTS.USERS).expect(STATUS_CODES.OK)) as UsersResponse;
    expect(response.body).toHaveLength(0);

    const newUser = {
      username: 'Zed',
      age: 18,
      hobbies: ['computer games', 'nodejs', 'fun'],
    };

    const postResponse = (await request
      .post(ENDPOINTS.USERS)
      .send(newUser)
      .expect(STATUS_CODES.CREATED)) as UserResponse;
    expect(postResponse.body).toMatchObject(newUser);
    expect(postResponse.body).toHaveProperty('id');
    expect(UserService.checkUserId(postResponse.body.id)).toBeTruthy();

    const createdUserID = postResponse.body.id ?? '';

    const responseAfterPost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterPost.body).toHaveLength(1);

    const getNewUserResponse = (await request
      .get(`${ENDPOINTS.USERS}/${createdUserID}`)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(getNewUserResponse.body).toMatchObject({ ...newUser, id: createdUserID });

    const userToUpdateWithoutUserName = {
      age: 18,
      hobbies: ['punk', 'not', 'dead'],
    };

    const putResponseWithoutName = await request
      .put(`${ENDPOINTS.USERS}/${createdUserID}`)
      .send(userToUpdateWithoutUserName)
      .expect(STATUS_CODES.BAD_REQUEST);
    expect(putResponseWithoutName.text).toBe(ERRORS.REQUIRED.NAME);

    const userToUpdateWithoutAge = {
      username: 'Simple Ivan',
      hobbies: ['punk', 'not', 'dead'],
    };

    const putResponseWithoutAge = await request
      .put(`${ENDPOINTS.USERS}/${createdUserID}`)
      .send(userToUpdateWithoutAge)
      .expect(STATUS_CODES.BAD_REQUEST);
    expect(putResponseWithoutAge.text).toBe(ERRORS.REQUIRED.AGE);

    const userToUpdateWithoutHobbies = {
      username: 'Simple Ivan',
      age: 44,
    };

    const putResponseWithoutHobbies = await request
      .put(`${ENDPOINTS.USERS}/${createdUserID}`)
      .send(userToUpdateWithoutHobbies)
      .expect(STATUS_CODES.BAD_REQUEST);
    expect(putResponseWithoutHobbies.text).toBe(ERRORS.REQUIRED.HOBBIES);

    const correctUserToUpdate = {
      username: 'Simple Ivan',
      age: 18,
      hobbies: ['punk', 'not', 'dead'],
    };

    const responseUpdatedUser = (await request
      .put(`${ENDPOINTS.USERS}/${createdUserID}`)
      .send(correctUserToUpdate)
      .expect(STATUS_CODES.OK)) as UserResponse;
    expect(responseUpdatedUser.body).not.toMatchObject({ ...newUser, id: createdUserID });
    expect(responseUpdatedUser.body).toMatchObject({ ...correctUserToUpdate, id: createdUserID });
  });

  test('Requests to non-existing endpoints should be handled, server should answer with status code 404 and corresponding human-friendly message', async () => {
    const response = (await request.get(ENDPOINTS.USERS).expect(STATUS_CODES.OK)) as UsersResponse;
    expect(response.body).toHaveLength(0);

    const getResponse = await request.get(`/unknown/path`).expect(STATUS_CODES.NOT_FOUND);
    expect(getResponse.text).toBe(RESPONSE_MESSAGES.BAD_REQUEST);

    const postResponse = await request.post(`/users/1245/qwerty`).expect(STATUS_CODES.NOT_FOUND);
    expect(postResponse.text).toBe(RESPONSE_MESSAGES.BAD_REQUEST);

    const putResponse = await request.put(`/another_unknown_path`).expect(STATUS_CODES.NOT_FOUND);
    expect(putResponse.text).toBe(RESPONSE_MESSAGES.BAD_REQUEST);

    const deleteResponse = await request
      .delete(`/some/wrong/path/users`)
      .expect(STATUS_CODES.NOT_FOUND);
    expect(deleteResponse.text).toBe(RESPONSE_MESSAGES.BAD_REQUEST);

    const responseAfter = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfter.body).toHaveLength(0);
  });
});
