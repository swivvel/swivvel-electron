import { getSiteUrl, loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureAppActivateHandler from './configureAppActivateHandler';
import configureCloseHandler from './configureCloseHandler';
import getHqWindowBrowserOptions from './getHqWindowBrowserOptions';
import { OpenHqWindow } from './types';
import updateTray from './updateTray';

const openHqWindow: OpenHqWindow = async (args) => {
  const { state, trayService, windowOpenRequestHandler } = args;

  const options = getHqWindowBrowserOptions();

  return openBrowserWindow(state, `hq`, options, async (window) => {
    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    configureCloseHandler(window, state);
    configureAppActivateHandler(openHqWindow, args);
    updateTray(openHqWindow, args, trayService);

    // By the time we open the HQ window the user should be logged in, so
    // the home page will redirect the user to their company's HQ page
    await loadUrl(`${getSiteUrl()}/`, window, state, {
      // The HQ window is opened automatically when the app starts, and it
      // defaults to being hidden. If it fails to load the URL, we don't want
      // to display an error message to the user because they probably don't
      // realize that the window was being loaded in the background. Instead,
      // we can just destroy the HQ window so that it gets recreated when the
      // user tries to open it again.
      onError: `destroyWindow`,
    });

    return window;
  });
};

export default openHqWindow;
