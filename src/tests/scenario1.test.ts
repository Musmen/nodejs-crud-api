import nock from 'nock';
import axios from 'axios';

import { userDB } from '../services/users/db/users.db.ts';
import { User } from '../services/users/users.service';

nock('http://localhost:4000').get('/api/users').reply(200, userDB);
nock('http://localhost:4000').post('/api/users').reply(200, userDB);

describe('simple tests', () => {
  test("should get empty users's db", async () => {
    const response = await axios.get('http://localhost:4000/api/users');
    const result = (await response.data) as User[];
    expect(result).toEqual(userDB);

    const newUser = {
      username: 'Zed',
      age: 18,
      hobbies: ['computer games', 'nodejs', 'fun'],
    };
    const response2 = await axios.post('http://localhost:4000/api/users', newUser);
    const result2 = (await response2.data) as User;
    expect(result2).toContain(newUser);
  });
});

// There could be some tests for API (not less than 3 scenarios).
// Example of test scenario:
// Get all records with a GET api/users request (an empty array is expected)
// A new object is created by a POST api/users request (a response containing newly created record is expected)
// With a GET api/users/{userId} request, we try to get the created record by its id (the created record is expected)
// We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)
// With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
// With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)
