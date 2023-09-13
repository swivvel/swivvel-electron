import { BrowserWindow, shell } from 'electron';
import log from 'electron-log';

import { loadInternalUrl, makeBrowserWindow, removeQueryParams } from './utils';

export default async (
  preloadPath: string,
  siteUrl: string
): Promise<BrowserWindow> => {
  log.info(`Creating log in window...`);

  const logInWindow = makeBrowserWindow(siteUrl, {
    browserWindowOptions: {
      height: 700,
      webPreferences: { preload: preloadPath },
      width: 720,
    },
  });

  logInWindow.webContents.on(`will-redirect`, (event) => {
    const { url } = event;
    log.info(`Caught redirect in log in window: ${removeQueryParams(url)}`);

    // See main repo README for description of desktop log in flow
    if (url.includes(`auth0.com/authorize`)) {
      log.info(`User is logging in, sending to browser for Google SSO`);
      event.preventDefault();
      shell.openExternal(url);
      return;
    }

    log.info(`Proceeding with redirect in log in window`);
  });

  await loadInternalUrl(logInWindow, siteUrl, `/`);

  log.info(`Created log in window`);

  return logInWindow;
};
