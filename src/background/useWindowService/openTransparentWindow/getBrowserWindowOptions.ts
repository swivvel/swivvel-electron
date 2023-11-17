import { BrowserWindowConstructorOptions, screen } from 'electron';

import {
  getPrimaryDisplayWorkAreaBounds,
  getPreloadPath,
  isLinux,
} from '../../utils';
import { Log } from '../utils';

export default (log: Log): BrowserWindowConstructorOptions => {
  log(`All displays: ${JSON.stringify(screen.getAllDisplays())}`);

  // const bounds = getPrimaryDisplayWorkAreaBounds(log);
  // const { height, width, x, y } = bounds;

  // log(`Setting transparent window bounds: ${JSON.stringify(bounds)}`);

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
    // type: isLinux() ? `splash` : undefined,
    frame: false,
    // hasShadow: false,
    // height,
    hiddenInMissionControl: true,
    // maximizable: false,
    // minimizable: false,
    // resizable: false,
    roundedCorners: false,
    show: true,
    // skipTaskbar: true,
    transparent: true,
    webPreferences: { preload: getPreloadPath() },
    // width,
    // x,
    // y,
  };
};
