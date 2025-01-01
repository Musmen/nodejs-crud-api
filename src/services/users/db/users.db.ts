// import { v1 as uuid } from 'uuid';

import { User } from '../types/user.type.ts';

// Should be removed later
// const USERS_TEST_DB: User[] = [
//   {
//     id: uuid(),
//     username: 'Kolya',
//     age: 25,
//     hobbies: ['swimming', 'hockey'],
//   },
//   {
//     id: uuid(),
//     username: 'Petya',
//     age: 37,
//     hobbies: ['chess', 'fencing'],
//   },
//   {
//     id: uuid(),
//     username: 'Zed',
//     age: 18,
//     hobbies: ['computer games', 'nodejs', 'fun'],
//   },
// ];

const USERS_TEST_DB: User[] = [];

export const userDB: User[] = USERS_TEST_DB;
