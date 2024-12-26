import { responseService } from '../response/response.service.ts';
import { User, userService, UserService } from '../users/users.service.ts';

import { getIdFromPathname, getPathnameFromUrl } from '../../common/helpers.ts';
import { ENDPOINTS } from '../../common/constants.ts';

class PathnameService {
  getPathnameFromUrl = (url: string | undefined): string => getPathnameFromUrl(url);

  getCurrentUserId = (pathname: string): string | undefined => getIdFromPathname(pathname);

  getCurrentUser = (currentUserId: string | undefined): User | undefined =>
    userService.findCurrentUserById(currentUserId);

  checkPathname = (pathname: string): boolean => {
    if (!pathname.startsWith(ENDPOINTS.USERS)) {
      responseService.sendNotFoundEndpoint();
      return false;
    } else if (pathname !== ENDPOINTS.USERS) {
      const currentUserId = this.getCurrentUserId(pathname);
      if (!UserService.checkUserId(currentUserId)) {
        responseService.sendBadRequest();
        return false;
      }

      const currentUser = this.getCurrentUser(currentUserId);
      if (!currentUser) {
        responseService.sendNotFoundData();
        return false;
      }
    }

    return true;
  };
}

export const pathnameService = new PathnameService();
