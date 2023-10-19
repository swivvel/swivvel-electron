import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from 'electron';
import log from 'electron-log';

import { State } from '../../types';
import { removeQueryParams, shouldOpenUrlInBrowser } from '../../utils';

export default async (
  state: State,
  browserWindowName: keyof State['windows'],
  browserWindowOptions: BrowserWindowConstructorOptions,
  instantiateBrowserWindow: (window: BrowserWindow) => Promise<BrowserWindow>,
  options?: {
    shouldOpenUrlInBrowser?: (url: string) => boolean | null;
  }
): Promise<BrowserWindow> => {
  log.info(`Get or create window: ${browserWindowName}`);

  const existingWindow = state.windows[browserWindowName];

  if (existingWindow && !existingWindow.isDestroyed()) {
    if (browserWindowOptions.show !== false) {
      log.info(`Showing existing window w/ focus: ${browserWindowName}`);
      existingWindow.show();
    } else {
      log.info(`Showing existing window w/o focus: ${browserWindowName}`);
      existingWindow.showInactive();
    }
    return existingWindow;
  }

  if (
    existingWindow &&
    !existingWindow.isDestroyed() &&
    existingWindow.webContents.isCrashed()
  ) {
    log.info(`Window crashed, destroying and recreating: ${browserWindowName}`);
    existingWindow.destroy();
  }

  log.info(`Creating window: ${browserWindowName}`);

  const browserWindow = new BrowserWindow(browserWindowOptions);

  state.windows[browserWindowName] = browserWindow;

  if (!browserWindow.isDestroyed()) {
    browserWindow.webContents.on(`will-navigate`, async (event) => {
      log.info(`Detected page navigation to: ${removeQueryParams(event.url)}`);

      let openUrlInBrowser: boolean | null = null;
      if (options?.shouldOpenUrlInBrowser) {
        openUrlInBrowser = options.shouldOpenUrlInBrowser(event.url);
      }

      if (openUrlInBrowser === null) {
        openUrlInBrowser = shouldOpenUrlInBrowser(event.url);
      }

      if (openUrlInBrowser) {
        log.info(`Opening URL in browser`);
        event.preventDefault();
        shell.openExternal(event.url);
        return;
      }

      log.info(`Opening URL in Electron`);
    });
  }

  if (!browserWindow.isDestroyed()) {
    await instantiateBrowserWindow(browserWindow);
  }

  log.info(`Created window: ${browserWindowName}`);

  if (!browserWindow.isDestroyed() && browserWindowOptions.show !== false) {
    browserWindow.show();
  }

  return browserWindow;
};
