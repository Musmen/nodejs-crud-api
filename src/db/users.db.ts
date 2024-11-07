import { v1 as uuid } from 'uuid';

import { User } from '../types/user.type.ts';

const id1 = uuid();
const id2 = uuid();
const id3 = uuid();

console.log(id1, id2, id3);

// Should be removed later
const USERS_TEST_DB: User[] = [
  {
    id: id1,
    username: 'Kolya',
    age: 25,
    hobbies: ['swimming', 'hockey'],
  },
  {
    id: id2,
    username: 'Petya',
    age: 37,
    hobbies: ['chess', 'fencing'],
  },
  {
    id: id3,
    username: 'Zed',
    age: 18,
    hobbies: ['computer games', 'nodejs', 'fun'],
  },
];

export const userDB: User[] = USERS_TEST_DB;
