import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { isLinux, isProduction, sleep } from './utils';

export default async (preloadPath: string): Promise<BrowserWindow> => {
  log.info(`Creating log in window...`);

  // Transparent windows don't work on Linux without some hacks
  // like this short delay
  // See: https://github.com/electron/electron/issues/15947
  if (isLinux()) {
    await sleep(1000);
  }

  const logInWindow = new BrowserWindow({
    height: 650,
    webPreferences: { preload: preloadPath },
    width: 720,
  });

  log.info(`  Loading Swivvel URL...`);

  await logInWindow.loadURL(`/`);

  if (!isProduction()) {
    logInWindow.webContents.openDevTools();
  }

  log.info(`Created log in window`);

  return logInWindow;
};
