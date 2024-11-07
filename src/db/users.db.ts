import { User } from '../types/user.type.ts';

// Should be removed later
const USERS_TEST_DB: User[] = [
  {
    id: 'aaa',
    username: 'Kolya',
    age: 25,
    hobbies: ['swimming', 'hockey'],
  },
  {
    id: 'bbb',
    username: 'Petya',
    age: 37,
    hobbies: ['chess', 'fencing'],
  },
  {
    id: 'ccc',
    username: 'Zed',
    age: 18,
    hobbies: ['computer games', 'nodejs', 'fun'],
  },
];

export const userDB: User[] = USERS_TEST_DB;
