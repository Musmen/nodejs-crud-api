import * as http from 'node:http';

import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

import { startServer, closeServer } from '../server.ts';

import { RESPONSE_MESSAGES, STATUS_CODES } from '../services/response/response.service.ts';
import { UserService } from '../services/users/users.service.ts';

import { ENDPOINTS } from '../common/constants.ts';

import { UserResponse, UsersResponse } from './types/response.type.ts';

describe('First test scenario', () => {
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

  test("Should get empty users's db", async () => {
    const response = (await request.get(ENDPOINTS.USERS).expect(STATUS_CODES.OK)) as UsersResponse;
    expect(response.body).toHaveLength(0);
  });

  test('Should create new object by a POST `api/users` request and response should contain newly created record', async () => {
    const newUser = {
      username: 'Zed',
      age: 18,
      hobbies: ['computer games', 'nodejs', 'fun'],
    };

    const responseBeforePost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseBeforePost.body).toHaveLength(0);

    const postResponse = (await request
      .post(ENDPOINTS.USERS)
      .send(newUser)
      .expect(STATUS_CODES.CREATED)) as UserResponse;
    expect(postResponse.body).toMatchObject(newUser);
    expect(postResponse.body).toHaveProperty('id');
    expect(UserService.checkUserId(postResponse.body.id)).toBeTruthy();

    const responseAfterPost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterPost.body).toHaveLength(1);
  });

  test('GET api/users/{userId} request should get the created record by its id', async () => {
    const newUser = {
      username: 'Igor Musmen',
      age: 10,
      hobbies: ['computer', 'games', 'books'],
    };

    const responseBeforePost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseBeforePost.body).toHaveLength(0);

    const postResponse = (await request
      .post(ENDPOINTS.USERS)
      .send(newUser)
      .expect(STATUS_CODES.CREATED)) as UserResponse;
    expect(postResponse.body).toMatchObject(newUser);
    expect(postResponse.body).toHaveProperty('id');
    expect(UserService.checkUserId(postResponse.body.id)).toBeTruthy();

    const responseAfterPost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterPost.body).toHaveLength(1);

    const newUserID = postResponse.body.id ?? '';
    const responseUser = (await request
      .get(`${ENDPOINTS.USERS}/${newUserID}`)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseUser.body).toMatchObject({ ...newUser, id: newUserID });
  });

  test('Should update the created record with a PUT api/users/{userId} request (a response should contain an updated object with the same id)', async () => {
    const newUser = {
      username: 'Ivan Fuckoff',
      age: 18,
      hobbies: ['punk', 'not', 'dead'],
    };

    const responseBeforePost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseBeforePost.body).toHaveLength(0);

    const postResponse = (await request
      .post(ENDPOINTS.USERS)
      .send(newUser)
      .expect(STATUS_CODES.CREATED)) as UserResponse;
    expect(postResponse.body).toMatchObject(newUser);
    expect(postResponse.body).toHaveProperty('id');
    expect(UserService.checkUserId(postResponse.body.id)).toBeTruthy();

    const newUserID = postResponse.body.id ?? '';
    const responseUser = (await request
      .get(`${ENDPOINTS.USERS}/${newUserID}`)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseUser.body).toMatchObject({ ...newUser, id: newUserID });

    const updatedUser = {
      username: 'Simple Ivan',
      age: 18,
      hobbies: ['punk', 'not', 'dead'],
    };

    const responseUpdatedUser = (await request
      .put(`${ENDPOINTS.USERS}/${newUserID}`)
      .send(updatedUser)
      .expect(STATUS_CODES.OK)) as UserResponse;
    expect(responseUpdatedUser.body).not.toMatchObject({ ...newUser, id: newUserID });
    expect(responseUpdatedUser.body).toMatchObject({ ...updatedUser, id: newUserID });

    const responseAfterPut = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterPut.body).toHaveLength(1);
  });

  test('DELETE api/users/{userId} request should delete the created object by id and should send confirmation of successful deletion', async () => {
    const newUser = {
      username: 'Petya Gromov',
      age: 45,
      hobbies: ['films', 'videos'],
    };

    const responseBeforePost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseBeforePost.body).toHaveLength(0);

    const postResponse = (await request
      .post(ENDPOINTS.USERS)
      .send(newUser)
      .expect(STATUS_CODES.CREATED)) as UserResponse;
    expect(postResponse.body).toMatchObject(newUser);
    expect(postResponse.body).toHaveProperty('id');
    expect(UserService.checkUserId(postResponse.body.id)).toBeTruthy();

    const responseAfterPost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterPost.body).toHaveLength(1);

    const newUserID = postResponse.body.id ?? '';
    await request.delete(`${ENDPOINTS.USERS}/${newUserID}`).expect(STATUS_CODES.NO_CONTENT);

    const responseAfterDelete = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterDelete.body).toHaveLength(0);
  });

  test(`GET api/users/{userId} request, when we are trying to get a deleted object by id should send answer is that there is no such object`, async () => {
    const newUser = {
      username: 'Soon we are going to delete this user...',
      age: 57,
      hobbies: [''],
    };

    const responseBeforePost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseBeforePost.body).toHaveLength(0);

    const postResponse = (await request
      .post(ENDPOINTS.USERS)
      .send(newUser)
      .expect(STATUS_CODES.CREATED)) as UserResponse;
    expect(postResponse.body).toMatchObject(newUser);
    expect(postResponse.body).toHaveProperty('id');
    expect(UserService.checkUserId(postResponse.body.id)).toBeTruthy();

    const responseAfterPost = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterPost.body).toHaveLength(1);

    const newUserID = postResponse.body.id ?? '';
    await request.delete(`${ENDPOINTS.USERS}/${newUserID}`).expect(STATUS_CODES.NO_CONTENT);

    const responseAfterDelete = (await request
      .get(ENDPOINTS.USERS)
      .expect(STATUS_CODES.OK)) as UsersResponse;
    expect(responseAfterDelete.body).toHaveLength(0);

    const getResponseAfterDelete = await request
      .get(`${ENDPOINTS.USERS}/${newUserID}`)
      .expect(STATUS_CODES.NOT_FOUND);
    expect(getResponseAfterDelete.text).toBe(RESPONSE_MESSAGES.NOT_FOUND);
  });
});
