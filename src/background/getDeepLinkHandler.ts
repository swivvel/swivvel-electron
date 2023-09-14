import log from 'electron-log';

import { State } from './types';
import { WindowService } from './useWindowService';
import { loadUrl } from './utils';

const convertDeepLinkUrlToHttps = (url: string): string => {
  return url.replace(/^swivvel:\/\//, `https://`);
};

export default (
  state: State,
  windowService: WindowService
): ((url: string) => Promise<void>) => {
  return async (url) => {
    // See main repo README for description of desktop log in flow
    if (url.includes(`/api/auth/callback`)) {
      log.info(`Running log in callback handler...`);

      const logInWindow = await windowService.openLogInWindow();

      log.info(`Loading OAuth callback URL into log in window...`);
      await loadUrl(convertDeepLinkUrlToHttps(url), logInWindow, state);
      log.info(`Loaded OAuth callback URL into log in window`);

      // After the OAuth URL loads, the log in window will catch a redirect
      // to the HQ page and refresh the transparent window to update the
      // transparent window state and trigger the the HQ page to open
    }
  };
};
