import { BrowserWindow } from 'electron';
import log from 'electron-log';

import createLogInWindow from './createLogInWindow';
import { State } from './types';

export default (
  state: State,
  preloadPath: string,
  siteUrl: string
): ((url: string) => Promise<void>) => {
  return async (url) => {
    log.info(`Handling deep link for URL: ${url}`);

    if (url.includes(`/api/auth/callback`)) {
      log.info(`Running log in callback handler...`);

      let logInWindow: BrowserWindow;

      if (state.logInWindow && !state.logInWindow.isDestroyed()) {
        logInWindow = state.logInWindow;
      } else {
        log.info(`Log in window missing, recreating...`);
        logInWindow = await createLogInWindow(preloadPath, siteUrl);
      }

      log.info(`Loading OAuth callback URL into log in window...`);
      await logInWindow.loadURL(url);
    }
  };
};
