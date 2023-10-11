import { BrowserWindowConstructorOptions, screen } from 'electron';
import log from 'electron-log';

import { getPreloadPath, isLinux } from '../../utils';

import { getBounds } from './utils';

export default (): BrowserWindowConstructorOptions => {
  log.info(`All displays: ${JSON.stringify(screen.getAllDisplays())}`);

  const bounds = getBounds();
  const { height, width, x, y } = bounds;

  log.info(`Setting transparent window bounds: ${JSON.stringify(bounds)}`);

  return {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    // closable: false,
    // On Mac, the window needs to be focusable for the mouse cursor to appear
    // as a pointer. On Linux, focusable must be true in order for the user
    // to type in text fields.
    focusable: true,
    // The "splash" type prevents the window from appearing in the alt+tab
    // window switcher on Linux.
    type: isLinux() ? `splash` : undefined,
    frame: false,
    hasShadow: false,
    height,
    hiddenInMissionControl: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    roundedCorners: false,
    skipTaskbar: true,
    transparent: true,
    webPreferences: { preload: getPreloadPath() },
    width,
    x,
    y,
  };
};
