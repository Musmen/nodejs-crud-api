import { responseService } from '../response/response.service.ts';
import { User, userService, UserService } from '../users/users.service.ts';

import { ENDPOINTS, URL_DELIMITER } from '../../common/constants.ts';

class PathnameService {
  private parseUrl = (url = '') => new URL(`http://${process.env.HOST ?? 'localhost'}${url}`);

  getPathnameFromUrl = (url: string | undefined = ''): string => this.parseUrl(url).pathname;

  getCurrentUserId = (pathname: string): string | undefined =>
    pathname.split(`${ENDPOINTS.USERS}${URL_DELIMITER}`).pop();

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
