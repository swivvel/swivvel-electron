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
    listenForRedirects(window, args);
    configureAppActivateHandler(openLogInWindow, args);
    updateTray(openLogInWindow, args, trayService);

    // Currently, the only way to display the log in page is to load the home
    // page. We only open the log in window if the user is unauthenticated,
    // so navigating to the home page here should always result in the log in
    // page being displayed.
    await loadUrl(`${getSiteUrl()}/`, window, state);

    return window;
  });
};

export default openLogInWindow;
