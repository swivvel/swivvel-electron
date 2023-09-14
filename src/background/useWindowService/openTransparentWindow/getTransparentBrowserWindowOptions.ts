import { BrowserWindowConstructorOptions, screen } from 'electron';

import { getPreloadPath, isLinux } from '../../utils';

export default (): BrowserWindowConstructorOptions => {
  const primaryDisplay = screen.getPrimaryDisplay();

  return {
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
    webPreferences: { preload: getPreloadPath() },
    width: primaryDisplay.workAreaSize.width,
    x: 0,
    y: 0,
  };
};
