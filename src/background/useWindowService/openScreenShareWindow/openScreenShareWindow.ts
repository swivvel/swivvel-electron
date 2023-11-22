import { getSiteUrl, loadUrl, makeQueryString } from '../../utils';
import {
  getBrowserWindowLogger,
  InstantiateWindow,
  openBrowserWindow,
} from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getBrowserWindowOptions from './getBrowserWindowOptions';
import { OpenScreenShareWindow } from './types';

const openScreenShareWindow: OpenScreenShareWindow = async (args) => {
  const {
    companyId,
    employeeId,
    employeeName,
    podId,
    state,
    windowOpenRequestHandler,
  } = args;

  const windowId = `screenShare${employeeId}` as const;
  const log = getBrowserWindowLogger(windowId);
  const windowOptions = getBrowserWindowOptions();

  const instantiateWindow: InstantiateWindow = async (window) => {
    window.webContents.setWindowOpenHandler(({ url }) => {
      return windowOpenRequestHandler(url, log);
    });

    configureCloseHandler(window, log);

    const queryData: Record<string, string> = {
      companyId,
      employeeId,
      podId,
    };

    if (employeeName) {
      queryData.employeeName = employeeName;
    }

    await loadUrl(
      `${getSiteUrl()}/screen-share?${makeQueryString(queryData)}`,
      window,
      state,
      log,
      {
        // The screen share window is opened from a user action. Normally we
        // should display an error if it fails to load the URL, but this
        // can actually happen quite easily if the user closes the window
        // while the URL is loading. So instead, we're just destroying the
        // window without showing an error.
        onError: `destroyWindow`,
      }
    );

    if (!window.isDestroyed()) {
      window.maximize();
    }

    return window;
  };

  return openBrowserWindow(
    state,
    windowId,
    windowOptions,
    log,
    instantiateWindow,
    {
      ifExists: `show`,
    }
  );
};

export default openScreenShareWindow;
