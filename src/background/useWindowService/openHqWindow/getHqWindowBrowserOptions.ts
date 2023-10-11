import { BrowserWindowConstructorOptions, screen } from 'electron';

import { getPreloadPath, isLinux } from '../../utils';

export default (show: boolean): BrowserWindowConstructorOptions => {
  const primaryDisplay = screen.getPrimaryDisplay();

  let height: number;
  let width: number;

  if (isLinux()) {
    // There's a bug on Ubuntu where the window title bar is transparent if
    // the window is sized to take up the entire work area, so make the window
    // large enough that it will probably fit on most screens.
    height = Math.min(primaryDisplay.workArea.height, 1000);
    width = Math.min(primaryDisplay.workArea.width, 1400);
  } else {
    height = primaryDisplay.workArea.height;
    width = primaryDisplay.workArea.width;
  }

  return {
    backgroundColor: `#ffffff`,
    center: true,
    height,
    show,
    webPreferences: { preload: getPreloadPath() },
    width,
  };
};
