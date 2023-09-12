import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { loadInternalUrl } from './utils';

export default async (
  preloadPath: string,
  siteUrl: string
): Promise<BrowserWindow> => {
  log.info(`Creating log in window...`);

  const logInWindow = new BrowserWindow({
    height: 700,
    webPreferences: { preload: preloadPath },
    width: 720,
  });

  await loadInternalUrl(logInWindow, siteUrl, `/`);

  log.info(`Created log in window`);

  return logInWindow;
};
