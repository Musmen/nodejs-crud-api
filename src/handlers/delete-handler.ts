import { userService } from '../services/users/users.service.ts';
import { responseService, STATUS_CODES } from '../services/response/response.service.ts';

export const deleteHandler = (currentUserId: string | undefined): void => {
  userService.removeUser(currentUserId);
  responseService.send('', STATUS_CODES.DELETED);
};
