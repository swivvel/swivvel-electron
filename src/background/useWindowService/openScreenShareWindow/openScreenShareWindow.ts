import { getSiteUrl, loadUrl } from '../../utils';
import {
  InstantiateWindow,
  getBrowserWindowLogger,
  openBrowserWindow,
} from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getBrowserWindowOptions from './getBrowserWindowOptions';
import { OpenScreenShareWindow } from './types';

const openScreenShareWindow: OpenScreenShareWindow = async (args) => {
  const { state, windowOpenRequestHandler } = args;

  const windowId = `screenShare` as const;
  const log = getBrowserWindowLogger(windowId);
  const windowOptions = getBrowserWindowOptions();

  const instantiateWindow: InstantiateWindow = async (window) => {
    window.webContents.setWindowOpenHandler(({ url }) => {
      return windowOpenRequestHandler(url, log);
    });

    configureCloseHandler(window, log);

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

export default openScreenShareWindow;
