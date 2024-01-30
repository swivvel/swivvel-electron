import { getSiteUrl, loadUrl } from '../../utils';
import {
  getBrowserWindowLogger,
  InstantiateWindow,
  openBrowserWindow,
} from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getBrowserWindowOptions from './getBrowserWindowOptions';
import getWindowCoordsAndSizeFromWindowName from './getWindowCoordsAndSizeFromWindowName';
import { OpenScreenShareWindow } from './types';

const openScreenShareOverlayWindow: OpenScreenShareWindow = async (args) => {
  const { state, windowOpenRequestHandler } = args;

  // This is what this function will need to get
  const screenShareWindowName = `Tot`;

  // const windowId = `screenShareOverlay${employeeId}` as const;
  const windowId = `screenShareOverlay` as const;
  const log = getBrowserWindowLogger(windowId);

  console.log(`<< Calling Function`);
  const windowCoordsAndSize = getWindowCoordsAndSizeFromWindowName(
    screenShareWindowName,
    log
  );
  console.log(`<< Called Function`);

  const windowOptions = await getBrowserWindowOptions(log, windowCoordsAndSize);

  const instantiateWindow: InstantiateWindow = async (window) => {
    window.webContents.setWindowOpenHandler(({ url }) => {
      return windowOpenRequestHandler(url, log);
    });

    // Show the window but don't focus it because it would be confusing to users
    // if an invisible window took focus.
    window.showInactive();

    // On Linux, calling `showInactive()` causes the window to no longer appear
    // on top, so we have to explicitly re-enable the always-on-top setting.
    window.setAlwaysOnTop(true);

    // Content in the transparent window is intended to be always visible, so
    // we have to make sure that the window is visible on all workspaces.
    window.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
      // See: https://github.com/electron/electron/issues/25368
      skipTransformProcessType: true,
    });

    // ! window.setIgnoreMouseEvents(true, { forward: true });

    configureCloseHandler(window, log);

    await loadUrl(`${getSiteUrl()}/screen-share-overlay`, window, state, log, {
      // The screen share window is opened from a user action. Normally we
      // should display an error if it fails to load the URL, but this
      // can actually happen quite easily if the user closes the window
      // while the URL is loading. So instead, we're just destroying the
      // window without showing an error.
      onError: `destroyWindow`,
    });

    // if (!window.isDestroyed()) {
    //   window.maximize();
    // }

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

export default openScreenShareOverlayWindow;
