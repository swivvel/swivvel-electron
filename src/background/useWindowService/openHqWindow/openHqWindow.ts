import { getSiteUrl, loadUrl } from '../../utils';
import {
  InstantiateWindow,
  getBrowserWindowLogger,
  openBrowserWindow,
} from '../utils';

import configureAppActivateHandler from './configureAppActivateHandler';
import configureCloseHandler from './configureCloseHandler';
import getBrowserWindowOptions from './getBrowserWindowOptions';
import { OpenHqWindow } from './types';
import updateTray from './updateTray';

const openHqWindow: OpenHqWindow = async (args) => {
  const { show, state, trayService, windowOpenRequestHandler } = args;

  const windowId = `hq` as const;
  const log = getBrowserWindowLogger(windowId);
  const windowOptions = getBrowserWindowOptions(show);

  const instantiateWindow: InstantiateWindow = async (window) => {
    window.webContents.setWindowOpenHandler(({ url }) => {
      return windowOpenRequestHandler(url, log);
    });

    configureCloseHandler(window, state, log);
    configureAppActivateHandler(openHqWindow, args, log);
    updateTray(openHqWindow, args, trayService, log);

    // By the time we open the HQ window the user should be logged in, so
    // the home page will redirect the user to their company's HQ page
    await loadUrl(`${getSiteUrl()}/`, window, state, log, {
      // The HQ window is opened automatically when the app starts, and it
      // defaults to being hidden. If it fails to load the URL, we don't want
      // to display an error message to the user because they probably don't
      // realize that the window was being loaded in the background. Instead,
      // we can just destroy the HQ window so that it gets recreated when the
      // user tries to open it again.
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

export default openHqWindow;
