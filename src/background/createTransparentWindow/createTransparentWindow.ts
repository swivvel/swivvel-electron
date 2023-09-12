import { BrowserWindow, screen } from 'electron';
import log from 'electron-log';

import { State } from '../types';
import { isLinux, isProduction, sleep } from '../utils';

import pollForMouseEvents from './pollForMouseEvents';

export default async (
  state: State,
  preloadPath: string
): Promise<BrowserWindow> => {
  log.info(`Creating transparent window...`);

  // Transparent windows don't work on Linux without some hacks
  // like this short delay
  // See: https://github.com/electron/electron/issues/15947
  if (isLinux()) {
    await sleep(1000);
  }

  const primaryDisplay = screen.getPrimaryDisplay();

  const transparentWindow = new BrowserWindow({
    alwaysOnTop: true,
    autoHideMenuBar: true,
    closable: false,
    // On Mac, the window needs to be focusable for the mouse cursor to appear
    // as a pointer. On Linux, the mouse cursor appears as a pointer on a
    // non-focusable window, but if the window is focusable then it appears
    // when using alt+tab to switch between windows.
    focusable: !isLinux(),
    frame: false,
    hasShadow: false,
    height: primaryDisplay.workAreaSize.height,
    hiddenInMissionControl: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    roundedCorners: false,
    skipTaskbar: true,
    transparent: true,
    webPreferences: { preload: preloadPath },
    width: primaryDisplay.workAreaSize.width,
    x: 0,
    y: 0,
  });

  transparentWindow.setIgnoreMouseEvents(true, { forward: true });

  transparentWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    // See: https://github.com/electron/electron/issues/25368
    skipTransformProcessType: true,
  });

  transparentWindow.on(`close`, (event) => {
    if (!state.allowQuit) {
      event.preventDefault();
      transparentWindow.hide();
    }
  });

  // See: https://github.com/electron/electron/issues/1335#issuecomment-1585787243
  pollForMouseEvents(transparentWindow);

  if (isProduction()) {
    await transparentWindow.loadURL(`https://app.swivvel.io/notifications`);
  } else {
    await transparentWindow.loadURL(
      `${process.env.ELECTRON_APP_DEV_URL}/notifications`
    );
  }

  log.info(`Created transparent window`);

  return transparentWindow;
};
