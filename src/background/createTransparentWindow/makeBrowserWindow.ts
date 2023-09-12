import { BrowserWindow, screen } from 'electron';
import log from 'electron-log';

import { isLinux } from '../utils';

export default (preloadPath: string): BrowserWindow => {
  log.info(`Creating transparent window BrowserWindow...`);

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

  return transparentWindow;
};
