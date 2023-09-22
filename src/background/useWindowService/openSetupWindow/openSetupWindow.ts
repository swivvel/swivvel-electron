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

    await loadUrl(`${getSiteUrl()}/setup`, window, state);

    return window;
  });
};

export default openSetupWindow;
