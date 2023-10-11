import { getSiteUrl, loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureAppActivateHandler from './configureAppActivateHandler';
import configureCloseHandler from './configureCloseHandler';
import getLogInWindowBrowserOptions from './getLogInWindowBrowserOptions';
import listenForRedirects from './listenForRedirects';
import { OpenLogInWindow } from './types';
import updateTray from './updateTray';

// See main repo README for description of desktop log in flow

const openLogInWindow: OpenLogInWindow = async (args) => {
  const { state, trayService, windowOpenRequestHandler } = args;

  const options = getLogInWindowBrowserOptions();

  return openBrowserWindow(state, `logIn`, options, async (window) => {
    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    configureCloseHandler(window, state);
    listenForRedirects(window, args, state);
    configureAppActivateHandler(openLogInWindow, args);
    updateTray(openLogInWindow, args, trayService);

    // Currently, the only way to display the log in page is to load the home
    // page. We only open the log in window if the user is unauthenticated,
    // so navigating to the home page here should always result in the log in
    // page being displayed.
    await loadUrl(`${getSiteUrl()}/`, window, state, {
      // The log in window is opened automatically by the transparent window
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

export default openLogInWindow;
