import { getSiteUrl, isLinux, loadUrl, sleep } from '../../utils';
import {
  InstantiateWindow,
  getBrowserWindowLogger,
  openBrowserWindow,
} from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getBrowserWindowOptions from './getBrowserWindowOptions';
import getFileLogger from './getFileLogger';
import { OpenTransparentWindow } from './types';

const openTransparentWindow: OpenTransparentWindow = async (args) => {
  const { state, windowOpenRequestHandler } = args;

  const windowId = `transparent` as const;
  const log = getBrowserWindowLogger(windowId);
  const fileLogger = getFileLogger(windowId);
  const windowOptions = getBrowserWindowOptions(log);

  const instantiateWindow: InstantiateWindow = async (window) => {
    // window.maximize();
    // window.blur();
    // window.setAlwaysOnTop(true);

    // window.setIgnoreMouseEvents(true, { forward: true });
    // window.maximize();
    // window.blur();
    // window.setAlwaysOnTop(true);

    // Prevent the transparent window from appearing in screenshots
    // See: https://www.electronjs.org/docs/latest/api/browser-window#winsetcontentprotectionenable-macos-windows
    // window.setContentProtection(true);
    // window.maximize();
    // window.blur();
    // window.setAlwaysOnTop(true);

    // Show the window but don't focus it because it would be confusing to users
    // if an invisible window took focus.
    // window.showInactive();
    // window.maximize();
    // window.blur();
    // window.setAlwaysOnTop(true);

    // On Linux, calling `showInactive()` causes the window to no longer appear
    // on top, so we have to explicitly re-enable the always-on-top setting.
    // window.setAlwaysOnTop(true);
    // window.maximize();
    // window.blur();
    // window.setAlwaysOnTop(true);

    // Content in the transparent window is intended to be always visible, so
    // we have to make sure that the window is visible on all workspaces.
    window.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
      // See: https://github.com/electron/electron/issues/25368
      skipTransformProcessType: true,
    });
    // window.maximize();
    // window.blur();
    // window.setAlwaysOnTop(true);

    // Write all console messages to a log file so that we can include the file
    // in Sentry alerts.
    window.webContents.on(`console-message`, (event, level, message) => {
      fileLogger.info(message);
    });

    window.webContents.setWindowOpenHandler(({ url }) => {
      return windowOpenRequestHandler(url, log);
    });

    configureCloseHandler(window, state, log);
    // window.maximize();
    // window.blur();
    // window.setAlwaysOnTop(true);

    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if (isLinux()) {
      await sleep(1000);
      // window.maximize();
      // window.blur();
      // window.setAlwaysOnTop(true);
    }

    await loadUrl(`${getSiteUrl()}/notifications`, window, state, log, {
      // The transparent window is core to the application because it's
      // responsible for opening all of the other windows and displaying the
      // audio room. Retry loading the URL indefinitely if it fails.
      onError: `retry`,
    });

    window.setMenuBarVisibility(false);
    window.maximize();
    window.setAutoHideMenuBar(true);
    window.setClosable(false);
    window.setHasShadow(false);
    window.setSkipTaskbar(true);
    window.setAlwaysOnTop(true);
    window.setIgnoreMouseEvents(true, { forward: true });

    console.log(`----------------------------------------------`);
    console.log(`isMaximizable:`, window.isMaximizable());
    console.log(`isMaximized:`, window.isMaximized());
    console.log(`isAlwaysOnTop:`, window.isAlwaysOnTop());
    console.log(`----------------------------------------------`);

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

export default openTransparentWindow;
