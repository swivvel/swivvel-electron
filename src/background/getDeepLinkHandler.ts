import log from 'electron-log';

import { WindowOpenHandler } from './getWindowOpenHandler';
import { State } from './types';
import { loadUrl } from './utils';
import {
  getOrCreateLogInWindow,
  getOrCreateTransparentWindow,
} from './windows';

const convertDeeplinkUrlToHttps = (url: string): string => {
  return url.replace(/^swivvel:\/\//, `https://`);
};

export default (
  state: State,
  preloadPath: string,
  siteUrl: string,
  windowOpenHandler: WindowOpenHandler
): ((url: string) => Promise<void>) => {
  return async (url) => {
    // See main repo README for description of desktop log in flow
    if (url.includes(`/api/auth/callback`)) {
      log.info(`Running log in callback handler...`);

      const logInWindow = await getOrCreateLogInWindow(
        state,
        preloadPath,
        siteUrl,
        windowOpenHandler
      );

      const transparentWindow = await getOrCreateTransparentWindow(
        state,
        preloadPath,
        siteUrl,
        windowOpenHandler
      );

      log.info(`Loading OAuth callback URL into log in window...`);
      await loadUrl(convertDeeplinkUrlToHttps(url), logInWindow, state);
      log.info(`Loaded OAuth callback URL into log in window`);

      logInWindow.close();
      transparentWindow.reload();
    }
  };
};
