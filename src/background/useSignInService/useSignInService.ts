import { WindowService } from '../useWindowService';

import handleSignInOAuthCallback from './handleSignInOAuthCallback';
import initiateSignIn from './initiateSignIn';
import { SignInService } from './types';

export default (windowService: WindowService): SignInService => {
  return {
    initiateSignIn: async (): Promise<boolean> => {
      return initiateSignIn(windowService);
    },
    handleSignInOAuthCallback: async (url: string): Promise<boolean> => {
      return handleSignInOAuthCallback(url, windowService);
    },
  };
};
