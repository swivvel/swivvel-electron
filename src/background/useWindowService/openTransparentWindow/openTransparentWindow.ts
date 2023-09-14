import { BrowserWindow } from 'electron';

import { isLinux } from '../../../utils';
import { loadUrl, sleep } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getTransparentBrowserWindowOptions from './getTransparentBrowserWindowOptions';
import pollForMouseEvents from './pollForMouseEvents';
import showOnAllWorkspaces from './showOnAllWorkspaces';
import { OpenTransparentWindow } from './types';

const openTransparentWindow: OpenTransparentWindow = async (args) => {
  const { preloadPath, siteUrl, state, windowOpenRequestHandler } = args;

  return openBrowserWindow(state, `transparent`, async () => {
    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if (isLinux()) {
      await sleep(1000);
    }

    const transparentWindow = new BrowserWindow(
      getTransparentBrowserWindowOptions(preloadPath)
    );

    transparentWindow.webContents.setWindowOpenHandler(
      windowOpenRequestHandler
    );

    showOnAllWorkspaces(transparentWindow);
    configureCloseHandler(transparentWindow, state);
    pollForMouseEvents(transparentWindow);

    await loadUrl(`${siteUrl}/notifications`, transparentWindow, state);

    return transparentWindow;
  });
};

export default openTransparentWindow;
