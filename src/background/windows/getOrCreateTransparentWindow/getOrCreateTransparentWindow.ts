import { BrowserWindow } from 'electron';

import { WindowOpenHandler } from '../../getWindowOpenHandler';
import { State } from '../../types';
import { getOrCreateBrowserWindow, isLinux, loadUrl, sleep } from '../../utils';

import configureCloseHandler from './configureCloseHandler';
import getTransparentBrowserWindowOptions from './getTransparentBrowserWindowOptions';
import pollForMouseEvents from './pollForMouseEvents';
import showOnAllWorkspaces from './showOnAllWorkspaces';

export default async (
  state: State,
  preloadPath: string,
  siteUrl: string,
  windowOpenHandler: WindowOpenHandler
): Promise<BrowserWindow> => {
  return getOrCreateBrowserWindow(state, `transparent`, async () => {
    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if (isLinux()) {
      await sleep(1000);
    }

    const transparentWindow = new BrowserWindow(
      getTransparentBrowserWindowOptions(preloadPath)
    );

    transparentWindow.webContents.setWindowOpenHandler(windowOpenHandler);

    showOnAllWorkspaces(transparentWindow);
    configureCloseHandler(transparentWindow, state);
    pollForMouseEvents(transparentWindow);

    await loadUrl(`${siteUrl}/notifications`, transparentWindow, state);

    return transparentWindow;
  });
};
