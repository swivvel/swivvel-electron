import { BrowserWindowConstructorOptions } from 'electron';

import { getFullscreenBounds, getPreloadPath, isLinux } from '../../utils';
import { Log } from '../utils';

import fetchWindowData from './fetchWindowData';
import { WindowCoordsAndSize } from './types';

export default async (
  log: Log,
  windowCoordsAndSize: WindowCoordsAndSize | null
): Promise<BrowserWindowConstructorOptions> => {
  let windowData: WindowCoordsAndSize;

  if (windowCoordsAndSize) {
    windowData = windowCoordsAndSize;
  } else {
    const bounds = await getFullscreenBounds(log);
    const { height, width, x, y } = bounds;

    windowData = { height, width, x, y };
  }

  setInterval(async () => {
    const newWindowData = await fetchWindowData(`screenShareWindowName`);

    if (newWindowData) {
      console.log(`<< Got new window data`, newWindowData);
      windowData = newWindowData;
    }
  }, 3000);

  return {
    height: windowData.height,
    width: windowData.width,
    x: windowData.x,
    y: windowData.y,
    webPreferences: { preload: getPreloadPath() },
    alwaysOnTop: true,
    autoHideMenuBar: true,
    // closable: false,
    // On Mac, the window needs to be focusable for the mouse cursor to appear
    // as a pointer. On Linux, focusable must be true in order for the user
    // to type in text fields.
    // focusable: false,
    // The "splash" type prevents the window from appearing in the alt+tab
    // window switcher on Linux.
    // type: isLinux() ? `splash` : undefined,
    frame: false,
    // hasShadow: false,
    // hiddenInMissionControl: true,
    // maximizable: false,
    // minimizable: false,
    // resizable: false,
    roundedCorners: false,
    // show: false,
    // skipTaskbar: true,
    transparent: true,
  };
};
