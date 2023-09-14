import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import log from 'electron-log';

import { State } from '../../types';

export default async (
  state: State,
  browserWindowName: keyof State['windows'],
  browserWindowOptions: BrowserWindowConstructorOptions,
  instantiateBrowserWindow: (window: BrowserWindow) => Promise<BrowserWindow>
): Promise<BrowserWindow> => {
  log.info(`Get or create window: ${browserWindowName}`);

  const existingWindow = state.windows[browserWindowName];

  if (existingWindow && !existingWindow.isDestroyed()) {
    log.info(`Showing existing window: ${browserWindowName}`);
    existingWindow.show();
    return existingWindow;
  }

  if (existingWindow && existingWindow.webContents.isCrashed()) {
    log.info(`Window crashed, destroying and recreating: ${browserWindowName}`);
    existingWindow.destroy();
  }

  log.info(`Creating window: ${browserWindowName}`);

  const browserWindow = new BrowserWindow(browserWindowOptions);

  state.windows[browserWindowName] = browserWindow;

  await instantiateBrowserWindow(browserWindow);

  log.info(`Created window: ${browserWindowName}`);

  browserWindow.show();

  return browserWindow;
};
