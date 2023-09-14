import { loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureAppActivateHandler from './configureAppActivateHandler';
import configureCloseHandler from './configureCloseHandler';
import getHqWindowBrowserOptions from './getHqWindowBrowserOptions';
import { OpenHqWindow } from './types';
import updateTray from './updateTray';

const openHqWindow: OpenHqWindow = async (args) => {
  const { preloadPath, siteUrl, state, trayService, windowOpenRequestHandler } =
    args;

  const options = getHqWindowBrowserOptions(preloadPath);

  return openBrowserWindow(state, `hq`, options, async (window) => {
    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    configureCloseHandler(window, state);
    configureAppActivateHandler(openHqWindow, args);
    updateTray(openHqWindow, args, trayService);

    // By the time we open the HQ window the user should be logged in, so
    // the home page will redirect the user to their company's HQ page
    await loadUrl(`${siteUrl}/`, window, state);

    return window;
  });
};

export default openHqWindow;
