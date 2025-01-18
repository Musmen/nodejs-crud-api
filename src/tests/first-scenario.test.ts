import axios from 'axios';

import { startServer, closeServer } from '../server.ts';

import { RESPONSE_MESSAGES, STATUS_CODES } from '../services/response/response.service.ts';
import { User } from '../services/users/users.service.ts';
import { getUrl } from './helpers.ts';

const NO_CONTENT_MESSAGE = 'No Content';
const usersEndpointUrl = getUrl();

beforeAll(() => {
  startServer();
});

afterAll(() => {
  closeServer();
});

describe('first test scenario', () => {
  test("should get empty users's db", async () => {
    const response = await axios.get(usersEndpointUrl);
    const userDB = (await response.data) as User[];
    expect(userDB.length).toBe(0);
  });

  test('should create new object by a POST `api/users` request and response should contain newly created record', async () => {
    const newUser = {
      username: 'Zed',
      age: 18,
      hobbies: ['computer games', 'nodejs', 'fun'],
    };
    const postResponse = await axios.post(usersEndpointUrl, newUser);
    const postResponsePayload = (await postResponse.data) as User;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(postResponsePayload).toMatchObject({ ...newUser, id: expect.any(String) });

    const responseAfter = await axios.get(usersEndpointUrl);
    const userDBAfter = (await responseAfter.data) as User[];
    expect(userDBAfter.length).toBe(1);
  });

  test('GET api/users/{userId} request should get the created record by its id', async () => {
    const newUser = {
      username: 'Igor Musmen',
      age: 10,
      hobbies: ['computer', 'games', 'books'],
    };
    const postResponse = await axios.post(usersEndpointUrl, newUser);
    const postResponsePayload = (await postResponse.data) as User;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(postResponsePayload).toMatchObject({ ...newUser, id: expect.any(String) });

    const newUserID = postResponsePayload.id ?? '';
    const responseUser = await axios.get(`${usersEndpointUrl}/${newUserID}`);
    const fetchedUser = (await responseUser.data) as User;
    expect(fetchedUser).toMatchObject({ ...newUser, id: newUserID });
  });

  test('Should update the created record with a PUT api/users/{userId} request (a response should contain an updated object with the same id)', async () => {
    const newUser = {
      username: 'Ivan Fuckoff',
      age: 18,
      hobbies: ['punk', 'not', 'dead'],
    };
    const postResponse = await axios.post(usersEndpointUrl, newUser);
    const postResponsePayload = (await postResponse.data) as User;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(postResponsePayload).toMatchObject({ ...newUser, id: expect.any(String) });

    const newUserID = postResponsePayload.id ?? '';
    const responseUser = await axios.get(`${usersEndpointUrl}/${newUserID}`);
    const fetchedUser = (await responseUser.data) as User;
    expect(fetchedUser).toMatchObject({ ...newUser, id: newUserID });

    const updatedUser = {
      username: 'Simple Ivan',
      age: 18,
      hobbies: ['punk', 'not', 'dead'],
    };
    const responseUpdatedUser = await axios.put(`${usersEndpointUrl}/${newUserID}`, updatedUser);
    const fetchedUpdatedUser = (await responseUpdatedUser.data) as User;
    expect(fetchedUpdatedUser).not.toMatchObject({ ...newUser, id: newUserID });
    expect(fetchedUpdatedUser).toMatchObject({ ...updatedUser, id: newUserID });
  });

  test('DELETE api/users/{userId} request should delete the created object by id and should send confirmation of successful deletion', async () => {
    const newUser = {
      username: 'Petya Gromov',
      age: 45,
      hobbies: ['films', 'videos'],
    };
    const postResponse = await axios.post(usersEndpointUrl, newUser);
    const postResponsePayload = (await postResponse.data) as User;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(postResponsePayload).toMatchObject({ ...newUser, id: expect.any(String) });

    const newUserID = postResponsePayload.id ?? '';
    const responseUser = await axios.get(`${usersEndpointUrl}/${newUserID}`);
    const fetchedUser = (await responseUser.data) as User;
    expect(fetchedUser).toMatchObject({ ...newUser, id: newUserID });

    const responseDeletedUser = await axios.delete(`${usersEndpointUrl}/${newUserID}`);
    const responseDeletedUserMessage = responseDeletedUser.statusText;
    expect(responseDeletedUserMessage).toBe(NO_CONTENT_MESSAGE);
  });

  test(`GET api/users/{userId} request, when we are trying to get a deleted object by id should send answer is that there is no such object`, async () => {
    const newUser = {
      username: 'Soon we are going to delete this user...',
      age: 57,
      hobbies: [''],
    };
    const postResponse = await axios.post(usersEndpointUrl, newUser);
    const postResponsePayload = (await postResponse.data) as User;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(postResponsePayload).toMatchObject({ ...newUser, id: expect.any(String) });

    const newUserID = postResponsePayload.id ?? '';
    const responseUser = await axios.get(`${usersEndpointUrl}/${newUserID}`);
    const fetchedUser = (await responseUser.data) as User;
    expect(fetchedUser).toMatchObject({ ...newUser, id: newUserID });

    const responseDeletedUser = await axios.delete(`${usersEndpointUrl}/${newUserID}`);
    const responseDeletedUserMessage = responseDeletedUser.statusText;
    expect(responseDeletedUserMessage).toBe(NO_CONTENT_MESSAGE);

    await axios
      .get(`${usersEndpointUrl}/${newUserID}`)
      // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
      .catch((error: { response: { statusText: string; status: string } }) => {
        expect(error.response.statusText).toBe(RESPONSE_MESSAGES.NOT_FOUND);
        expect(error.response.status).toBe(STATUS_CODES.NOT_FOUND);
      });
  });
});
