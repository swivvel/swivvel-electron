import { BrowserWindow } from 'electron';

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

  return openBrowserWindow(state, `hq`, async () => {
    const hqWindow = new BrowserWindow(getHqWindowBrowserOptions(preloadPath));

    hqWindow.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    configureCloseHandler(hqWindow, state);
    configureAppActivateHandler(openHqWindow, args);
    updateTray(openHqWindow, args, trayService);

    // By the time we open the HQ window the user should be logged in, so
    // the home page will redirect the user to their company's HQ page
    await loadUrl(`${siteUrl}/`, hqWindow, state);

    return hqWindow;
  });
};

export default openHqWindow;
