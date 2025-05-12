import { User } from '../../services/users/users.service';

export interface UserResponse {
  body: User;
}
export interface UsersResponse {
  body: User[];
}
