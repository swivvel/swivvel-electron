import { getSiteUrl, isLinux, loadUrl, sleep } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getTransparentBrowserWindowOptions from './getTransparentBrowserWindowOptions';
import pollForMouseEvents from './pollForMouseEvents';
import resizeOnDisplayChange from './resizeOnDisplayChange';
import showOnAllWorkspaces from './showOnAllWorkspaces';
import { OpenTransparentWindow } from './types';

const openTransparentWindow: OpenTransparentWindow = async (args) => {
  const { state, windowOpenRequestHandler } = args;

  const options = getTransparentBrowserWindowOptions();

  return openBrowserWindow(state, `transparent`, options, async (window) => {
    // Prevent the transparent window from appearing in screenshots
    // See: https://www.electronjs.org/docs/latest/api/browser-window#winsetcontentprotectionenable-macos-windows
    window.setContentProtection(true);

    // Show the window but don't focus it because it would be confusing to users
    // if an invisible window took focus.
    window.showInactive();

    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if (isLinux()) {
      await sleep(1000);
    }

    window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

    showOnAllWorkspaces(window);
    configureCloseHandler(window, state);
    pollForMouseEvents(window);
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
