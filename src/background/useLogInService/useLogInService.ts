import { WindowService } from '../useWindowService';

import handleLogInOAuthCallback from './handleLogInOAuthCallback';
import initiateLogIn from './initiateLogIn';
import { LogInService } from './types';

export default (windowService: WindowService): LogInService => {
  return {
    initiateLogIn: async (): Promise<boolean> => {
      return initiateLogIn(windowService);
    },
    handleLogInOAuthCallback: async (url: string): Promise<boolean> => {
      return handleLogInOAuthCallback(url, windowService);
    },
  };
};
