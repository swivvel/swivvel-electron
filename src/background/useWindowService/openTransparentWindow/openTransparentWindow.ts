import { isLinux, loadUrl, sleep } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getTransparentBrowserWindowOptions from './getTransparentBrowserWindowOptions';
import pollForMouseEvents from './pollForMouseEvents';
import showOnAllWorkspaces from './showOnAllWorkspaces';
import { OpenTransparentWindow } from './types';

const openTransparentWindow: OpenTransparentWindow = async (args) => {
  const { preloadPath, siteUrl, state, windowOpenRequestHandler } = args;

  const options = getTransparentBrowserWindowOptions(preloadPath);

  return openBrowserWindow(state, `transparent`, options, async (window) => {
    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if (isLinux()) {
      await sleep(1000);
    }

    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    showOnAllWorkspaces(window);
    configureCloseHandler(window, state);
    pollForMouseEvents(window);

    await loadUrl(`${siteUrl}/notifications`, window, state);

    return window;
  });
};

export default openTransparentWindow;