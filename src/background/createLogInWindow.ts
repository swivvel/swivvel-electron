import { BrowserWindow, shell } from 'electron';
import log from 'electron-log';

import {
  getBaseWindowOpenHandler,
  loadInternalUrl,
  removeQueryParams,
} from './utils';

export default async (
  preloadPath: string,
  siteUrl: string
): Promise<BrowserWindow> => {
  log.info(`Creating log in window...`);

  const logInWindow = new BrowserWindow({
    height: 700,
    webPreferences: { preload: preloadPath },
    // width: 720,
    width: 1400,
  });

  logInWindow.webContents.setWindowOpenHandler(({ url }) => {
    log.info(`Caught URL opened by log in window: ${url}`);

    // We want to be able to reuse Google session cookies from the user's
    // browser, so we send them to the browser to log in. Auth0 will redirect
    // the user back to the desktop app using the `swivvel://` protocol.
    // if (removeQueryParams(url) === `${siteUrl}/api/auth/login`) {
    //   log.info(`User is logging in, sending to browser for Google SSO`);
    //   shell.openExternal(url);
    //   return { action: `deny` };
    // }

    return getBaseWindowOpenHandler(url, siteUrl);
  });

  logInWindow.webContents.on(`will-redirect`, (event) => {
    log.info(`----------------------- will-redirect ----------------------`);
    log.info(event);
    event.preventDefault();
  });

  await loadInternalUrl(logInWindow, siteUrl, `/`);

  logInWindow.webContents.openDevTools();

  log.info(`Created log in window`);

  return logInWindow;
};
