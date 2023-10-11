import { getSiteUrl, loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureAppActivateHandler from './configureAppActivateHandler';
import configureCloseHandler from './configureCloseHandler';
import getSetupWindowBrowserOptions from './getSetupWindowBrowserOptions';
import { OpenSetupWindow } from './types';
import updateTray from './updateTray';

const openSetupWindow: OpenSetupWindow = async (args) => {
  const { state, trayService, windowOpenRequestHandler } = args;

  const options = getSetupWindowBrowserOptions();

  return openBrowserWindow(state, `setup`, options, async (window) => {
    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    configureCloseHandler(window, state);
    configureAppActivateHandler(openSetupWindow, args);
    updateTray(openSetupWindow, args, trayService);

    await loadUrl(`${getSiteUrl()}/setup`, window, state, {
      // The setup window is opened automatically by the transparent window
      // when the app first launches. If it fails to load the URL, we don't want
      // to keep retrying because the user would see a blank window. Instead,
      // just destroy the window. It will either be recreated when the user
      // tries to open Swivvel from the tray, or the transparent window will
      // have also failed to load and it will open the log in window when it
      // gets recreated.
      onError: `destroyWindow`,
    });

    return window;
  });
};

export default openSetupWindow;
