import { getSiteUrl, loadUrl } from '../../utils';
import {
  InstantiateWindow,
  getBrowserWindowLogger,
  openBrowserWindow,
} from '../utils';

import configureAppActivateHandler from './configureAppActivateHandler';
import configureCloseHandler from './configureCloseHandler';
import getBrowserWindowOptions from './getBrowserWindowOptions';
import { OpenSetupWindow } from './types';
import updateTray from './updateTray';

const openSetupWindow: OpenSetupWindow = async (args) => {
  const { state, trayService, windowOpenRequestHandler } = args;

  const windowId = `setup` as const;
  const log = getBrowserWindowLogger(windowId);
  const windowOptions = getBrowserWindowOptions();

  const instantiateWindow: InstantiateWindow = async (window) => {
    window.webContents.setWindowOpenHandler(({ url }) => {
      return windowOpenRequestHandler(url, log);
    });

    configureCloseHandler(window, state, log);
    configureAppActivateHandler(openSetupWindow, args, log);
    updateTray(openSetupWindow, args, trayService, log);

    await loadUrl(`${getSiteUrl()}/setup`, window, state, log, {
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
  };

  return openBrowserWindow(
    state,
    windowId,
    windowOptions,
    log,
    instantiateWindow
  );
};

export default openSetupWindow;
