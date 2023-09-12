import { BrowserWindow } from 'electron';
import log from 'electron-log';

export default async (preloadPath: string): Promise<BrowserWindow> => {
  log.info(`Creating log in window...`);
  log.info(preloadPath);

  const logInWindow = new BrowserWindow({
    height: 700,
    webPreferences: { preload: preloadPath },
    width: 720,
  });

  log.info(`  Loading Swivvel URL...`);

  await logInWindow.loadURL(`/`);

  logInWindow.webContents.openDevTools();

  log.info(`Created log in window`);

  return logInWindow;
};
