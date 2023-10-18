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
  const { companyId, podId, state, windowOpenRequestHandler } = args;

  const windowId = `screenShare` as const;
  const log = getBrowserWindowLogger(windowId);
  const windowOptions = getBrowserWindowOptions();

  const instantiateWindow: InstantiateWindow = async (window) => {
    window.webContents.setWindowOpenHandler(({ url }) => {
      return windowOpenRequestHandler(url, log);
    });

    configureCloseHandler(window, log);

    await loadUrl(
      `${getSiteUrl()}/screen-share?companyId=${companyId}&podId=${podId}`,
      window,
      state,
      log,
      {
        // The screen share window is opened from a user action. If it fails to
        // load, we should let the user know that we failed to complete their
        // action and then close the window so they can try again.
        onError: `warnAndDestroyWindow`,
      }
    );

    window.maximize();

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
