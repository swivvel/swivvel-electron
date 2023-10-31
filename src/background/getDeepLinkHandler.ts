import log from 'electron-log';

import { SignInService } from './useSignInService';

const convertDeepLinkUrlToHttps = (url: string): string => {
  return url.replace(/^swivvel:\/\//, `https://`);
};

export default (
  signInService: SignInService
): ((url: string) => Promise<void>) => {
  return async (url) => {
    // See main repo README for description of desktop log in flow
    if (url.includes(`/api/auth/callback`)) {
      log.info(`Running log in callback handler...`);

      const deepLinkUrl = convertDeepLinkUrlToHttps(url);

      log.info(`Proxying request to ${deepLinkUrl}...`);

      await signInService.handleSignInOAuthCallback(deepLinkUrl);

      log.info(`Sign in callback handler complete`);
    }
  };
};
