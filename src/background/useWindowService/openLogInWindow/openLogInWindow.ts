import { BrowserWindow } from 'electron';

import { loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureAppActivateHandler from './configureAppActivateHandler';
import configureCloseHandler from './configureCloseHandler';
import listenForRedirects from './listenForRedirects';
import { OpenLogInWindow } from './types';
import updateTray from './updateTray';

// See main repo README for description of desktop log in flow

const openLogInWindow: OpenLogInWindow = async (args) => {
  const { preloadPath, siteUrl, state, trayService, windowOpenRequestHandler } =
    args;

  return openBrowserWindow(state, `logIn`, async () => {
    const logInWindow = new BrowserWindow({
      height: 700,
      webPreferences: { preload: preloadPath },
      width: 720,
    });

    logInWindow.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    configureCloseHandler(logInWindow, state);
    listenForRedirects(logInWindow, args);
    configureAppActivateHandler(openLogInWindow, args);
    updateTray(openLogInWindow, args, trayService);

    // Currently, the only way to display the log in page is to load the home
    // page. We only open the log in window if the user is unauthenticated,
    // so navigating to the home page here should always result in the log in
    // page being displayed.
    await loadUrl(`${siteUrl}/`, logInWindow, state);

    return logInWindow;
  });
};

export default openLogInWindow;
