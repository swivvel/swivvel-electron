import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../types';

export default async (
  state: State,
  browserWindowName: keyof State['windows'],
  createBrowserWindow: () => Promise<BrowserWindow>
): Promise<BrowserWindow> => {
  log.info(`Get or create window: ${browserWindowName}`);

  const existingWindow = state.windows[browserWindowName];

  if (existingWindow && !existingWindow.isDestroyed()) {
    log.info(`Returning existing window: ${browserWindowName}`);
    return existingWindow;
  }

  if (existingWindow && existingWindow.webContents.isCrashed()) {
    log.info(`Window crashed, destroying and recreating: ${browserWindowName}`);
    existingWindow.destroy();
  }

  log.info(`Creating window: ${browserWindowName}`);

  const browserWindow = await createBrowserWindow();

  state.windows[browserWindowName] = browserWindow;

  log.info(`Created window: ${browserWindowName}`);

  return browserWindow;
};
