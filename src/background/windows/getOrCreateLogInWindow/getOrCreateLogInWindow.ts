import { BrowserWindow, shell } from 'electron';
import log from 'electron-log';

import { WindowOpenHandler } from '../../getWindowOpenHandler';
import { State } from '../../types';
import {
  getOrCreateBrowserWindow,
  isProduction,
  loadUrl,
  removeQueryParams,
} from '../../utils';

// See main repo README for description of desktop log in flow

export default async (
  state: State,
  preloadPath: string,
  siteUrl: string,
  windowOpenHandler: WindowOpenHandler
): Promise<BrowserWindow> => {
  return getOrCreateBrowserWindow(state, `logIn`, async () => {
    const logInWindow = new BrowserWindow({
      height: 700,
      webPreferences: { preload: preloadPath },
      width: 720,
    });

    logInWindow.webContents.setWindowOpenHandler(windowOpenHandler);

    logInWindow.webContents.on(`will-redirect`, (event) => {
      const { url } = event;
      log.info(`Caught redirect in log in window: ${removeQueryParams(url)}`);

      if (url.includes(`auth0.com/authorize`)) {
        // The `swivvel://` protocol doesn't work in development environments,
        // so we have to perform the log in flow within Electron
        if (!isProduction()) {
          log.info(`Skipping redirect to browser - development environment`);
        } else {
          log.info(`User is logging in, sending to browser for Google SSO`);
          event.preventDefault();
          shell.openExternal(url);
          return;
        }
      }

      log.info(`Proceeding with redirect in log in window`);
    });

    await loadUrl(`${siteUrl}/`, logInWindow, state);

    return logInWindow;
  });
};
