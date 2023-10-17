import { getSiteUrl, isLinux, loadUrl, sleep } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getLogger from './getLogger';
import getTransparentBrowserWindowOptions from './getTransparentBrowserWindowOptions';
import resizeOnDisplayChange from './resizeOnDisplayChange';
import showOnAllWorkspaces from './showOnAllWorkspaces';
import { OpenTransparentWindow } from './types';

const openTransparentWindow: OpenTransparentWindow = async (args) => {
  const { state, windowOpenRequestHandler } = args;

  const transparentWindowLog = getLogger(`transparent`);
  const options = getTransparentBrowserWindowOptions();

  return openBrowserWindow(state, `transparent`, options, async (window) => {
    window.setIgnoreMouseEvents(true, { forward: true });

    // Prevent the transparent window from appearing in screenshots
    // See: https://www.electronjs.org/docs/latest/api/browser-window#winsetcontentprotectionenable-macos-windows
    window.setContentProtection(true);

    // Show the window but don't focus it because it would be confusing to users
    // if an invisible window took focus.
    window.showInactive();

    // On Linux, calling `showInactive()` causes the window to no longer appear
    // on top, so we have to explicitly re-enable the always-on-top setting.
    window.setAlwaysOnTop(true);

    // Write all console messages to a log file so that we can include the file
    // in Sentry alerts.
    window.webContents.on(`console-message`, (event, level, message) => {
      transparentWindowLog.info(message);
    });

    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if (isLinux()) {
      await sleep(1000);
    }

    showOnAllWorkspaces(window);
    configureCloseHandler(window, state);
    resizeOnDisplayChange(window);

    await loadUrl(`${getSiteUrl()}/notifications`, window, state, {
      // The transparent window is core to the application because it's
      // responsible for opening all of the other windows and displaying the
      // audio room. Retry loading the URL indefinitely if it fails.
      onError: `retry`,
    });

    return window;
  });
};

export default openTransparentWindow;
