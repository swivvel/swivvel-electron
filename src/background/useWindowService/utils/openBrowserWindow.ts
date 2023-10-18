import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from 'electron';

import { State } from '../../types';
import { removeQueryParams, shouldOpenUrlInBrowser } from '../../utils';

export type InstantiateWindow = (
  window: BrowserWindow
) => Promise<BrowserWindow>;

export default async (
  state: State,
  windowId: keyof State['windows'],
  windowOptions: BrowserWindowConstructorOptions,
  log: (msg: string) => void,
  instantiateWindow: InstantiateWindow,
  options?: {
    onWillNavigate?: (
      window: BrowserWindow,
      event: Electron.Event<Electron.WebContentsWillNavigateEventParams>
    ) => Promise<boolean>;
  }
): Promise<BrowserWindow> => {
  log(`Get or create`);

  const existingWindow = state.windows[windowId];

  if (existingWindow && !existingWindow.isDestroyed()) {
    if (windowOptions.show !== false) {
      log(`Showing existing window w/ focus`);
      existingWindow.show();
    } else {
      log(`Showing existing window w/o focus`);
      existingWindow.showInactive();
    }
    return existingWindow;
  }

  if (
    existingWindow &&
    !existingWindow.isDestroyed() &&
    existingWindow.webContents.isCrashed()
  ) {
    log(`Window crashed, destroying and recreating`);
    existingWindow.destroy();
  }

  log(`Creating window`);

  const browserWindow = new BrowserWindow(windowOptions);

  state.windows[windowId] = browserWindow;

  if (!browserWindow.isDestroyed()) {
    browserWindow.webContents.on(`will-navigate`, async (event) => {
      if (options?.onWillNavigate) {
        const handled = await options.onWillNavigate(browserWindow, event);
        if (handled) {
          return;
        }
      }

      log(`Detected page navigation to: ${removeQueryParams(event.url)}`);

      if (shouldOpenUrlInBrowser(event.url)) {
        log(`Opening URL in browser`);
        event.preventDefault();
        shell.openExternal(event.url);
        return;
      }

      log(`Opening URL in Electron`);
    });
  }

  if (!browserWindow.isDestroyed()) {
    await instantiateWindow(browserWindow);
  }

  log(`Created window`);

  if (!browserWindow.isDestroyed() && windowOptions.show !== false) {
    browserWindow.show();
  }

  return browserWindow;
};
