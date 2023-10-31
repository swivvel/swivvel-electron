import log from 'electron-log';

import { LogInService } from './useLogInService';

const convertDeepLinkUrlToHttps = (url: string): string => {
  return url.replace(/^swivvel:\/\//, `https://`);
};

export default (
  logInService: LogInService
): ((url: string) => Promise<void>) => {
  return async (url) => {
    // See main repo README for description of desktop log in flow
    if (url.includes(`/api/auth/callback`)) {
      log.info(`Running log in callback handler...`);

      const deepLinkUrl = convertDeepLinkUrlToHttps(url);

      log.info(`Proxying request to ${deepLinkUrl}...`);

      await logInService.handleLogInOAuthCallback(deepLinkUrl);

      log.info(`Log in callback handler complete`);
    }
  };
};
